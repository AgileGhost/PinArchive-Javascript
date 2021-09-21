//calling in packages
const { Client, Intents, Collection, MessageEmbed, Permissions } = require("discord.js");
const { readdirSync, statSync } = require("fs");
const { TOKEN, MONGOOSE_LOGIN } = require("./config.json");
const mongoose = require("mongoose");

//calling in database models
const GuildData = require("./Models/GuildData.js");
const ChannelData = require("./Models/ChannelData");


//init the main client.
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ["MESSAGE", "CHANNEL", "REACTION"] });

//connecting to the mongoDB database
mongoose.connect(MONGOOSE_LOGIN, { useNewUrlParser: true, useUnifiedTopology: true });
//states the connection when there is an update and when it connects
mongoose.connection.on("connected", async () => {
    console.log("successfully connected to the database");
});

mongoose.connection.on("disconnected", async () => {
    console.log("The connection to the database has ended!");
});

mongoose.connection.on("error", async (err) => {
    console.log(`There was an error with the connection to the database: ${console.log(err)}`);
});

//Collections, Main Cache Data 
client.InteractionCommands = new Collection();
client.MessageCommands = new Collection();
client.Audit = new Collection();

//Grabs a folder and then grabs all the sub folders within that folder
function GetDirectories(location) {
    return readdirSync(location).filter(function subFolder(folder) {
        return statSync(location + "/" + folder).isDirectory();
    });
}
//Assuming there will be no commands outside of the subfolders
//Importing Interaction Commands
//FOLDER:      ./Commands/Interaction
let InteractionFiles = [];
for (const folder of GetDirectories("./Commands/Interaction")) {
    const folderFiles = readdirSync("./Commands/Interaction/" + folder).filter(file => file.endsWith(".js"));
    for (const file of folderFiles) {
        InteractionFiles.push([folder, file]);
    }
}
//Loads and stashes the interactions
for (const file of InteractionFiles) {
    let command;
    if (Array.isArray(file)) {
        command = require("./Commands/Interaction/" + file[0] + "/" + file[1]);
        console.log("Loading Interaction: " + file[1] + " in " + file[0]);
    } else {
        //not really needed by hey just in case
        console.log("hmmm, there seems to be an error loading an interaction!");
    }
    client.InteractionCommands.set(command.name, command);
}



//Importing Message Commands
//FOLDER:       ./Commands/Message
let MsgCmdFiles = [];
for (const folder of GetDirectories("./Commands/Message")) {
    const folderFiles = readdirSync("./Commands/Message/" + folder).filter(file => file.endsWith(".js"));
    for (const file of folderFiles) {
        MsgCmdFiles.push([folder, file]);
    }
}

//loads and stashes the msg commands
for (const file of MsgCmdFiles) {
    let command;
    if (Array.isArray(file)) {
        command = require("./Commands/Message/" + file[0] + "/" + file[1]);
        console.log("Loading Msg CMD: " + file[1] + " in " + file[0]);
    } else {
        //not really needed by hey just in case
        console.log("hmmm, there seems to be an error loading an message command!");
    }
    client.MessageCommands.set(command.name, command);
}

//reads the DIR of the audit folder(s) and grabs all the js files
let AuditFiles = readdirSync("./Audit").filter(file => file.endsWith(".js"));
for (const folder of GetDirectories("./Audit")) {
    const auditFolderFiles = readdirSync("./Audit/" + folder).filter(file => file.endsWith(".js"));
    for (const file of auditFolderFiles) {
        AuditFiles.push([folder, file]);    
    }
}

//loads the audit files
for (const file of AuditFiles) {
    let audit; 
    if (Array.isArray(file)) {
        audit = require("./Audit/" + file[0] + "/" + file[1]);
        console.log("#Audit: " + file[1] + "has loaded, within " + file[0]);
    } else {
        audit = require("./Audit/" + file);
        console.log("#Audit: " + file + " has been loaded");
    }
    client.Audit.set(audit.name, audit);
}


//When the client is online and ready to do below executes
client.on("ready", () => {
    console.log("Connected! Logged in as " + client.user.tag);
    //prepares all the commands and sends them out to the avaliable guilds.
    let InterData = [];
    //making an array with the files to push to the server
    client.InteractionCommands.forEach(interaction => {
        let newInt = {
            name: interaction.name,
            description: interaction.description
        }
        InterData.push(newInt);
    });
    //console.log(InterData);          //just to see if the array is actually being created!
    client.guilds.cache.forEach(async guild => {
        await guild.commands.set(InterData).catch(err => {
            //ERROR HANDLER HERE
            return console.log(err);//console.log("There was an error updating interaction commands for guild " + guild.id + " this may be due to insufficient perms!");
        });
        console.log(guild.id + " has been updated!!");
    });
});


//INTERACTION CREATED.          When an interaction is sent to the bot.
client.on("interactionCreate", interaction => {
    console.log(interaction);               //gives raw data of the interaction. Recommended to be commented out
    if (!interaction.isCommand()) return;           //if the interaction isn't a command
    //finds a match out of the commands
    client.InteractionCommands.forEach(cmd => {
        if (cmd.name === interaction.commandName) {
            cmd.execute(interaction);
        }
    });
});

//MESSAGE CREATED           When a message is send on the guild/DM's
client.on("messageCreate", async message => {
    if (message.system) return;
    if (message.bot) return;
    if (!message.guild.id) return;
    //console.log(message);
    GuildData.findOne({ id: message.guild.id }, async (err, GuildD) => {
        //if no Guild data found it will just ignore all messages
        if (!GuildD) {
            //The creation of a new Schema to be saved
            try {
                let channel = await message.guild.channels.cache.find(c => c.name === "pin-archive");
                if (!channel) {
                    //creates a channel if it was unable to find one.
                    if (message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) {
                        channel = message.guild.channels.create("pin-archive", {
                            topic: "An archive of all pinned messages",
                            permissionOverwrites: [
                                {
                                    id: message.guild.roles.everyone,
                                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                                    deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]
                                },
                                {
                                    id: message.guild.me,
                                    allow: [Permissions.FLAGS.SEND_MESSAGES]
                                }
                            ],
                            reason: "Created as I was unable to find any pin-archive channel!",
                        });
                        let newPinEmbed = new MessageEmbed()
                            .setColor("#0477BE")
                            .setDescription("Created this channel as I was unable to find any 'pin-archive'");
                        channel.send(newPinEmbed);
                    } else {
                        channel = "pin-archive";
                        try {
                            message.guild.systemChannel.send();
                        } catch (err) {
                            //dont have perms to send within the channel! I could look through all channels and find the first that the bot can talk
                            //in but that isn't needed atm
                            console.log(err);
                        }
                    }
                }
                const NewGuildData = new GuildData({
                    id: message.guild.id,
                    creationDate: Date.now(),
                    pinArchive: {
                        channel: channel.id
                    }
                });
                return NewGuildData.save();
            } catch (err) {
                console.log(err);
            }
        } else {
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const MentionRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(GuildD.prefix)})\\s*`);
            let msgLC = message.content.toLowerCase();
            //checks if the message has the bot's mention or the normal message prefix and trims it out
            if (MentionRegex.test(msgLC)) {
                const [, matchedPrefix] = msgLC.match(MentionRegex);
                if (msgLC.startsWith(matchedPrefix)) {
                    //splits the message into arguments for each word and trims out the command name in its own var
                    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
                    const commandName = args.shift().toLowerCase();
                    //now grabbing the command and checking for an alias
                    const command = client.MessageCommands.get(commandName) || client.MessageCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                    if (!command) return;

                    //Checks both the bots and users perms
                    if (message.member.permissions.has(command.userPermissions) && message.guild.me.permissions.has(command.botPermissions)) {
                        //executes the command yay
                        command.execute(message, args);
                    } else {
                        message.channel.send("Missing Permission!");
                    }
                }
            }
        }
    });
    //Below isn't the best way of doing this, although it fixes a bug in return of some resource usage it doesn't remove old/deleted channels, taking up storage over time. 
    //It would be best to keep track of channels through events and to make sure it checks all channels on boot up and joining for the first time
    message.guild.channels.cache.forEach(channel => {
        //checks if the channels can have messages sent within them
        if (channel.type !== "GUILD_VOICE" || channel.type !== "GUILD_Store") {
            //checks the exisitance of an entry into the database for all the channels
            ChannelData.findOne({ id: channel.id }, (err, chdata) => {
                //creation of the new data structure
                if (!chdata) {  //checks if there is already an entry and skips it
                    const NewChannelData = new ChannelData({
                        id: channel.id,
                        creationDate: Date.now(),
                        guildID: message.guild.id
                    });
                    //saves the data
                    return NewChannelData.save().catch(err => console.log(err));
                }
            });
        }
    });
});


//defining to the pinarchive code
//const PinArchive = require("./Audit/channelPinsUpdate.js");
client.on("channelPinsUpdate", async channel => {
    //If there is infomation missing due to missing the event, it will try to grab the infomation
    if (channel.partial) {
        try {
            //grabs info
            await channel.fetch();
        } catch (err) {
            //oh no. How did we get here XD
            return console.log(err);
        }
    }
    if (!channel.guild) return;     //returns if there isn't a guild attached
    //Sends the event to another place
    //The small delay fixes an issue were a quick event will run before its saved from the first one
    setTimeout(() => {
        //looks for the correct audit file and executes it.
        client.Audit.find(aud => aud.name === "channelPinsUpdate").execute(channel);
    }, 1000);       //delay of 1 seconds to stop api lag and a double event
});


client.on("messageReactionAdd", async (reaction, user) => {
    //Checks if the event is a partial event and is missing data
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (err) {
            return console.log(err);
        }
    }
    //checks if the reaction is within a guild if not returns
    if (!reaction.message.guildId) return;
    //looks for audit then executes the file.
    client.Audit.find(aud => aud.name === "messageReactionAdd").execute(reaction, user, client);
});








//Uses the super secert token to login to the bot
client.login(TOKEN);