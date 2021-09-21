module.exports = {
    name: "settings",
    description: "Change settings for the bot, to view current settings use the interaction",
    userPermissions: [],
    botPermissions: [],
    async execute(message, args) {
        //will use an eval command at the end to change settings as it would be way more effecient to do so
        if (!args[0]) return message.channel.send("Invalid response...\nNeeds to be either `prefix`, `autoremove`, `archiveall`, `reactions`, `channel` then its following subcategory or value\nIf you're looking for current settings please use the interaction command");
        if (!args[1]) return message.channel.send("Invalid response...\nNeeds to be either `prefix`, `autoremove`, `archiveall`, `reactions`, `channel` then its following subcategory or value\nIf you're looking for current settings please use the interaction command");
        let string = "Gdata."
        //sorts out the possible results
        await switch (args[0].toLowerCase()) {
            case "prefix":
                string + "prefix";
                break;
            case "autoremove":
                string + "pinArchive.autoRemove";
                break;
            case "reactions":
                string + "pinArchive.reaction";
                break;
            case "archiveall":
                string + "pinArchive.archiveAll";
                break;
            case "channel":
                string + "pinArchive.channel";
                break;
            default:
                return message.channel.send("Invalid response...\nNeeds to be either `prefix`, `autoremove`, `archiveall`, `reactions`, `channel`");
        }
        if (args[0].toLowerCase() === "reactions" || args[0].toLowerCase === "channel" || args[0].toLowerCase() === "prefix") {





        } else if (args[1].toLowerCase() === "true" || args[1].toLowerCase() === "t" || args[1].toLowerCase() === "enabled" || args[1].toLowerCase() === "enable") {
            eval(string + " = true");
        } else if (args[1].toLowerCase() === "false" || args[1].toLowerCase() === "f" || args[1].toLowerCase() === "disabled" || args[1].toLowerCase() === "disable") {
            eval(string + " = false");
        }





        message.channel.send("Pong!");
    }
};