const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");
const archivePin = require("../Functions/archivePin.js");
var methods = {
    name: "messageReactionAdd",             //for when a command handler is added for the AUDIT stuff
    async execute(reaction, user) {
        
    }
}

module.exports = methods;