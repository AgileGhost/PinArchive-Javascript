const ChannelData = require("../Models/ChannelData.js");
const GuildData = require("../Models/GuildData.js");

var methods = {
    name: "PinArchive",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, (err, guildD) => {
            ChannelData.findOne({ id: channel.id }, (err, chdata) => {
                if (!chdata || !guildD) return;         //oh no something went wrong and no data was found
                let pins;
                let Tpins = 0;
                let Fpin = false        //all pins, pins count, If the pin was found and archived;
                if (chdata.pinArchive.enabled && guildD.pinArchive.enabled) {
                    try {
                        pins = await channel.messages.fetchPinned();
                        Tpins = pins.length;
                        //if has reached the pin max on channel, it will remove the old one
                        if (Tpins < 49) {
                            //unpins the last one Needs a try method and possibly checking perms
                        }
                        console.log(pins);
                        console.log(Tpins);
                        console.log(Fpin);








                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        });
    }
}

module.exports = methods;