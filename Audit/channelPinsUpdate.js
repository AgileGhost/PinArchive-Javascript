const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");

var methods = {
    name: "PinArchive",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, (err, guildD) => {
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
                let Fpin = false        //all pins, pins count, If the pin was found and archived;
                if (chdata.pinArchive.enabled && guildD.pinArchive.enabled) {
                    let SendPins = [];
                    try {
                        pins = await channel.messages.fetchPinned();
                        //shifts through all the pins in a loop
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




                }
            });
        });
    }
}



module.exports = methods;