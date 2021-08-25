//calling in packages
const { Client, Intents, Collection } = require("discord.js");
const { readdirSync, statSync } = require("fs");
const { TOKEN } = require("./config.json");


//init the main client.
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Collections, Main Cache Data. Decided to make my own instead of relying on the built in ones as they sometimes miss information. 
client.InteractionCommands = new Collection();
client.MessageCommands = new Collection();
client.GuildData = new Collection();
client.MemberData = new Collection();

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
        InteractionFiles([folder, file]);
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
    const folderFiles = readdirSync("./Command/Message/" + folder).filter(file => file.endsWith(".js"));
    for (const file of folderFiles) {
        MsgCmdFiles([folder, file]);
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
    console.log(InterData);          //just to see if the array is actually being created!
    client.guilds.cache.forEach(async guild => {
        console.log(guild.id + " has been updated!!");
        await guild.commands.set(InterData);
    });
});


//INTERACTION CREATED.          When an interaction is sent to the bot.
client.on("interactionCreate", interaction => {
    console.log(interaction);               //gives raw data of the interaction. Recommended to be commented out
    if (interaction.isCommand()) return;           //if the interaction isn't a command
    //finds a match out of the commands
    client.InteractionCommands.forEach(cmd => {
        if (cmd.name === interaction.commandName) {
            cmd.execute(interaction);
        }
    });
});

//MESSAGE CREATED           When a message is send on the guild/DM's
client.on("messageCreate", async msg => {
    console.log(msg);
});











//Uses the super secert token to login to the bot
client.login(TOKEN);