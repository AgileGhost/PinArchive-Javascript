const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");
const archivePin = require("../Functions/archivePin.js");
var methods = {
    name: "channelPinsUpdate",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, async (err, Gdata) => {
            ChannelData.findOne({ id: channel.id }, async (err, chdata) => {
                if (!Gdata) return;         //oh no something went wrong and no data was found
                if (!chdata) {
                    const NewChannelData = new ChannelData({
                        id: channel.id,
                        guildID: channel.guild.id,
                        creationDate: Date.now()
                    });
                    NewChannelData.save().catch(err => console.log(err));
                    chdata = NewChannelData;            //redefines the var
                }
                let pins;
                let Tpins = 0;
                if (chdata.pinArchive.enabled && Gdata.pinArchive.enabled) {
                    let SendPins = [];
                    pins = await channel.messages.fetchPinned();
                    //shifts through all the pins in a loop
                    pins.forEach(pin => {
                        Tpins++;
                        let i = 0;
                        chdata.pinArchive.pinnedMessages.forEach(ArchID => {
                            //if there is a match then it will skip over the message
                            if (ArchID === pin.id) {
                                i++;
                            }
                        });
                        if (i === 0) {
                            SendPins.push(pin);
                            chdata.pinArchive.pinnedMessages.push(pin.id);
                        }
                    });
                    //updates the database with the new list
                    chdata.save().catch(err => console.log(err));
                    //Makes sure there is a pin to be sent.
                    if (Tpins > 49 && Gdata.pinArchive.autoRemove) {
                        try {
                            pins.last().unpin();
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    //console.log("road");
                    //console.log(SendPins.length);
                    if (SendPins.length > 0) {
                        //console.log("here");
                        if (Gdata.pinArchive.archiveAll === false) {
                            SendPins = [SendPins.pop()];
                        }
                        //console.log(SendPins);
                        //Checks if the channel is private, (both the channel itself and setting) if so will send a confirmation
                        if (chdata.pinArchive.private || !channel.permissionsFor(channel.guild.roles.everyone).has(Permissions.FLAGS.VIEW_CHANNEL)) {
                            //the creation of an embed.
                            let confirmEmbed = new MessageEmbed()
                                .setAuthor("pin-archive")
                                .setDescription("This channel has been classified as a private channel, would you like to archive a total of " + SendPins.length + " pin(s)? Otherwise it will be removed once 50 more pins have been added")
                                .setTimestamp()
                                .setFooter("ID: " + channel.id);
                            //The row underneath the message mainly for buttons like this
                            let row = new MessageActionRow()
                                .addComponents(
                                    //Button one, to confirm
                                    new MessageButton()
                                        .setCustomId("PinConfirm")
                                        .setLabel("Confirm")
                                        .setStyle("SUCCESS"),
                                    //Button two, to deny
                                    new MessageButton()
                                        .setCustomId("PinDeny")
                                        .setLabel("Deny")
                                        .setStyle("DANGER")
                                );
                            //sends the message to the channel
                            let ConfirmMsg = await channel.send({ embeds: [confirmEmbed], components: [row] });
                            //Creating an interaction listener waiting for an interaction, filters out others interactions and only waits for 15 seconds
                            let CollectorFilter = i => i.customID === "PinConfirm" || i.customID === "PinDeny";
                            const collector = channel.createMessageComponentCollector({ CollectorFilter, time: 15000 });
                            //when the collector above finds an event
                            collector.on("collect", async i => {
                                await ConfirmMsg.delete();
                                if (i.customId === "PinConfirm") {
                                    //console.log("Yeah send it");
                                    archivePin.execute(channel, SendPins, Gdata);
                                }
                            });
                        } else {
                            //SEND MESSAGES
                            //console.log("false");
                            archivePin.execute(channel, SendPins, Gdata);
                        }
                    }
                }
            });
        });
    }
}

module.exports = methods;