const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");

var methods = {
    name: "PinArchive",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, async (err, guildD) => {
            ChannelData.findOne({ id: channel.id }, async (err, chdata) => {
                if (!guildD) return;         //oh no something went wrong and no data was found
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
                if (chdata.pinArchive.enabled && guildD.pinArchive.enabled) {
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
                        if (SendPins.length > 0) {
                            if (SendPins > 1) {     //Checks if archive all is on, if so it will just ignore, if not will trim to the first found.
                                if (!guild.pinArchive.archiveAll) {
                                    //NOTE: last pin in SendPins will be the first (found) on the list
                                    SendPins = SendPins.last();
                                    console.log(SendPins);
                                }
                            }
                            //Checks if the channel is private, (both the channel itself and setting) if so will send a confirmation
                            if (chdata.pinArchive.private || !channel.permissionsFor(channel.guild.roles.everyone).has(Permissions.FLAGS.VIEW_CHANNEL)) {
                                console.log("True");
                                //the creation of an embed.
                                let confirmEmbed = new MessageEmbed()
                                    .setAuthor("pin-archive")
                                    .setDescription("This channel has been classified as a private channel, would you like to archive this pin? Otherwise it will be removed once 50 more pins have been added")
                                    .setTimestamp()
                                    .setFooter("ID: " + channel.id);
                                //The row underneath the message mainly for buttons like this
                                let row = new MessageActionRow()
                                    .addComponents(
                                        //Button one, to confirm
                                        new MessageButton()
                                            .setCustomId("Confirm")
                                            .setLabel("Confirm")
                                            .setStyle("SUCCESS"),
                                        //Button two, to deny
                                        new MessageButton()
                                            .setCustomId("Deny")
                                            .setLabel("Deny")
                                            .setStyle("DANGER")
                                );
                                //sends the message to the channel
                                channel.send({ embeds: [confirmEmbed], components: [row] });





                            } else {
                                //SEND MESSAGES
                                console.log("false");
                            }






                            let delay = 0;
                            //Loops through all the pins to send
                            //Works better than a 'forEach' loop in this case
                            for (let i = 0; i < SendPins.length; i++) {

                            }
                        }
                        /*
                        pins.forEach(pin => {
                            Tpins++;
                            let i = 0;
                            //loops through all the pins archived
                            //Makes sure there is an array to loop though
                            if (chdata.pinArchive.pinnedMessages.length > 0) {
                                chdata.pinArchive.pinnedMessages.forEach(archivedID => {
                                    //if finds a match will count up by one
                                    if (pin.id === archivedID) {
                                        i++;
                                    }
                                    //if no match is found then it will try to send the message
                                });
                                if (i === 0) {
                                    Fpin = true;
                                    //Adds message to the sending list and adds the new ID to the archive list.
                                    chdata.pinArchive.pinnedMessages.push(pin.id);
                                    SendPins.push(pin);
                                }
                            } else {
                                //If there is no array to loop through it will just archive them all unless the setting is disabled.
                                if (guildD.pinArchive.archiveAll) {
                                    //if enabled sends the message
                                    //Adds message to the sending list and adds the new ID to the archive list.
                                    chdata.pinArchive.pinnedMessages.push(pin.id);
                                    SendPins.push(pin);
                                } else {
                                    //if disabled checks if one has already been sent since pins are all in order
                                    if (!Fpin) {
                                        Fpin = true;
                                        //Adds message to the sending list and adds the new ID to the archive list.
                                        chdata.pinArchive.pinnedMessages.push(pin.id);
                                        SendPins.push(pin);
                                    }
                                }
                            }
                        });
                        //for just in case the event executes when there isnt a pin added like if someone removed a pin
                        if (Fpin && guildD.pinArchive.autoRemove) {
                            //removes a pin if there is 50 pins or more
                            //console.log("PIN REMOVAL TOOL");
                            if (Tpins > 49) {
                                try {
                                //unpins
                                    //console.log("Found a pin and was removed");
                                    pins.last().unpin({ reason: 'Removed the oldest pin due to the cap being hit!' });
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    chdata.save().catch(err => console.log(err));
                    if (SendPins.length > 0) {
                        console.log(SendPins);






                    }
                    */



                }
            });
        });
    }
}



module.exports = methods;