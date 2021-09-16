const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");
const archivePin = require("../Functions/archivePin.js");
var methods = {
    name: "messageReactionAdd",             //for when a command handler is added for the AUDIT stuff
    async execute(reaction, user) {
        //Grabs the data on the guild
        GuildData.findOne({ id: reaction.message.guildId }, async (err, Gdata) => {
            if (!Gdata) return;     //If there is no data it will return as the bot isn't set up correctly
            if (reaction.emoji.name === Gdata.pinArchive.reaction.emoji && Gdata.pinArchive.reaction.enabled) {
                if (reaction.count > Gdata.pinArchive.reaction.count) {
                    ChannelData.findOne({ id: reaction.message.channelId }, async (err, chdata) => {
                        //Loops through all the archived ids
                        let found = false;
                        for (let i = 0; i < chdata.pinArchive.pinnedMessages.length; i++) {
                            //if the two ID's match
                            if (chdata.pinArchive.pinnedMessages[i] === reaction.message.id) {
                                //sets found to true
                                found = true;
                            }
                        }
                        if (!found) {
                            //Sends to archive
                        }
                    });
                }
            }
        });
    }
}

module.exports = methods;