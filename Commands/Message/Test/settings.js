const GuildData = require("../../../Models/GuildData");

module.exports = {
    name: "settings",
    description: "Change settings for the bot, to view current settings use the interaction",
    userPermissions: [],
    botPermissions: [],
    async execute(message, args) {
        //below makes sure there is actual arguments to work with
        if (!args[0]) return message.channel.send("Invalid response...\nNeeds to be either `autoremove`, `archiveall`, `reactions`, then a following `true` or `false`\nIf you want to view the current settings use the interaction command");
        if (!args[1]) return message.channel.send("Invalid response...\nNeeds to be either `autoremove`, `archiveall`, `reactions`, then a following `true` or `false`\nIf you want to view the current settings use the interaction command");
        if (args[1]) {
            //checks if the send argument is actually true or false otherwise will spit an error
            if (args[1].toLowerCase() !== "false" && args[1].toLowerCase() !== "true") {
                return message.channel.send("Invalid response...\nNeeds to be either `autoremove`, `archiveall`, `reactions`, then a following `true` or `false`")
            }
        }
        //grabs guild data
        GuildData.findOne({ id: message.guild.id }, (err, Gdata) => {
            if (!Gdata) return message.channel.send("I was unable to handle this command at the moment, please try again later!");
            switch (args[0].toLowerCase()) {
                case "archiveall":
                    //console.log("yes?");
                    //console.log(args[1]);
                    if (args[1].toLowerCase() === "true") {     //if true will update the value to true and saves it
                        //console.log("t");
                        Gdata.pinArchive.archiveAll = true;
                    } else {                                    //if false will update the value to false and saves it
                        //console.log("f");
                        Gdata.pinArchive.archiveAll = false;
                    }
                    message.channel.send("Updated " + args[0] + " to " + args[1]);          //Mentions that it was updated
                    Gdata.save().catch(err => console.log(err));
                    break;
                case "autoremove":
                    if (args[1].toLowerCase() === "true") {
                        Gdata.pinArchive.autoRemove = true;
                    } else {
                        Gdata.pinArchive.autoRemove = false;
                    }
                    message.channel.send("Updated " + args[0] + " to " + args[1]);
                    Gdata.save().catch(err => console.log(err));
                    break;
                case "reactions":
                    if (args[1].toLowerCase() === "true") {
                        Gdata.pinArchive.reaction.enabled = true;
                    } else {
                        Gdata.pinArchive.reaction.enabled = false;
                    }
                    message.channel.send("Updated " + args[0] + " to " + args[1]);
                    Gdata.save().catch(err => console.log(err));
                    break;
                default:        //if args[0] isnt valid
                    return message.channel.send("Invalid response...\nNeeds to be either `autoremove`, `archiveall`, `reactions`, then a following `true` or `false`");
            }
        });
    }
};