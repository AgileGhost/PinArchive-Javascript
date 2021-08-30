//calling in packages
const { Client, Intents, Collection } = require("discord.js");
const { readdirSync, statSync } = require("fs");
const { TOKEN, MONGOOSE_LOGIN } = require("./config.json");
const mongoose = require("mongoose");

//calling in database models
const GuildData = require("./Models/GuildData.js");


//init the main client.
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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
            console.log(err);
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
client.on("messageCreate", async msg => {
    if (message.system) return;
    if (message.bot) return;
    if (!message.guild.id) return;
    console.log(msg);
    GuildData.findOne({ id: message.guild.id }, (err, GuildD) => {
        if (!GuildD) {
            const NewGuildData = new GuildData({
                id: message.guild.id,
                creationDate: Date.now()
            });
            return NewGuildData.save().catch(err => console.log(err));
        } else {
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
                    if (message.member.hasPermission(command.userPermissions) && message.guild.me.hasPermission(command.botPermissions)) {
                        //executes the command yay
                        command.execute(message, args);
                    } else {
                        message.channel.send("Missing Permission!");
                    }
                }
            }
        }
    });
});











//Uses the super secert token to login to the bot
client.login(TOKEN);