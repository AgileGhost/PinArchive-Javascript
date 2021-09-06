const GuildData = require("../Models/GuildData.js");

var methods = {
    name: "PinArchive",             //for when a command handler is added for the AUDIT stuff
    async execute(channel) {
        GuildData.findOne({ id: channel.guild.id }, (err, GuildD) => {
            let pins;
            let Tpins = 0;
            if (GuildD.pinArchive.enabled) {
                //fetches all pinned messages of the channel
                try {
                    pins = await channel.message.fetchPinned();
                } catch (err) {
                    //likely to due to missing perms but can be anything
                    return console.log(err);
                }
                //if it was unable to find any pins
                if (!pins) return console.log("Unable to find any pins");
                //counts the total pins
                pins.forEach(pin => {
                    Tpins++;
                });
                if (Tpins > 49) {
                    try {
                        //removes pin
                    } catch (err) {
                        console.log(err);       //likely due to no perms to remove pins
                    }
                }
                





                console.log(pins);


                console.log(GuildD);
                console.log(channel);







            }
        });
    }
}

module.exports = methods;