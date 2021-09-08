const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");

var methods = {
    name: "PinArchive",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, (err, guildD) => {
            ChannelData.findOne({ id: channel.id }, async (err, chdata) => {
                console.log("EXECUTED");
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
                    console.log("OKAY!");
                    try {
                        pins = await channel.messages.fetchPinned();
                        //shifts through all the pins in a loop
                        pins.forEach(pin => {
                            Tpins++;
                            let i = 0;
                            //console.log("LOOOP!");
                            //loops through all the pins archived
                            //Makes sure there is an array to loop though
                            console.log(chdata.pinArchive.pinnedMessages.length);
                            if (chdata.pinArchive.pinnedMessages.length > 0) {
                                chdata.pinArchive.pinnedMessages.forEach(archivedID => {
                                    //if finds a match will count up by one
                                    //console.log("LOOOP 2!");
                                    if (pin.id === archivedID) {
                                        i++;
                                        console.log("FOUND ONE!");
                                    }
                                    //if no match is found then it will try to send the message
                                });
                                if (i !== 0) {
                                    Fpin = true;
                                    console.log("Found a new pin!");
                                    //SENDS MESSAGE

                                    SendPin(pin, channel, chdata, guildD);
                                }
                            } else {
                                //If there is no array to loop through it will just archive them all unless the setting is disabled.
                                if (guildD.pinArchive.archiveAll) {
                                    //if enabled sends the message
                                    //SEND MESSGE
                                    SendPin(pin, channel, chdata, guildD);

                                } else {
                                    //if disabled checks if one has already been sent since pins are all in order
                                    if (!Fpin) {
                                        Fpin = true;
                                        //SEND MESSAGE
                                        SendPin(pin, channel, chdata, guildD);

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

                                    console.log("Found a pin and was going to remove it");

                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        });
    }
}

function SendPin(pin, channel, chdata, guildD) {
    chdata.pinArchive.pinnedMessages.push(pin.id);
    console.log("Pushed " + pin.id + " to the archived list!");
    chdata.save().catch(err => console.log(err));
    console.log("sending....");
}








module.exports = methods;