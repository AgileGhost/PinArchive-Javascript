const { MessageEmbed } = require("discord.js");


var methods = {
    async execute(channel, SendPins, Gdata) {
        let delay = 0;
        let ArchiveChannel = channel.guild.channels.cache.find(c => c.name === Gdata.pinArchive.channel) || channel.guild.channels.cache.get(Gdata.pinArchive.channel);
        if (!ArchiveChannel) return;
        for (let i = 0; i < SendPins.length; i++) {
            let pin = SendPins[i];
            //the default structure for the embed
            let pinEmbed = new MessageEmbed()
                .setColor(channel.guild.me.displayHexColor)
                .setAuthor(pin.author.username, pin.author.avatarURL({ size: 256, dynamic: true }))
                .setFooter("Send within #" + channel.name);
            //if there is an attachment in the message
            if (pin.attachments.size > 0) {
                //loops through all the attachments
                pin.attachments.each(attachment => {
                    //checks if the channel is NSFW
                    if (channel.nsfw) {
                        pinEmbed.addField("This image was sent within a NSFW channel!", "Please click on the links above to see the original message");
                    } else {
                        //if not NSFW
                        pinEmbed.setImage(attachment.proxyURL);
                    }
                    //if there is a message along with the attachement
                    if (pin.content !== '') {
                        if (channel.nsfw) {
                            pinEmbed.setDescription("|| " + pin.content + " ||");
                        } else {
                            pinEmbed.setDescription(pin.content);
                        }
                    }
                    pinEmbed.addField("Original: ", "[Original](https://discord.com/channels/" + channel.guild.id + "/" + channel.id + "/" + pin.id + ")");
                    try {
                        //tries to delay the messages sent when there is a large bulk of message to reduce api abuse
                        setTimeout(() => {
                            delay = delay + 3500;
                            //sends the data to the channel
                            ArchiveChannel.send({ embeds: [pinEmbed] });
                            //console.log(delay);
                        }, delay);
                    } catch (err) {
                        console.log(err);
                    }
                });
            } else {
               //If only one/no attachment in the message
                pinEmbed.addField("Link: ", "[Original](https://discord.com/channels/" + channel.guild.id + "/" + channel.id + "/" + pin.id + ")");
                if (channel.nsfw) { //checks if NSFW channel
                    //if NSFW hides the message behind a spoiler (needs a check on the messsage so it doesn't break any spoilers before)
                    pinEmbed.addField("Send within a NSFW channel", "|| " + pin.content + " ||");
                } else {
                    //if not NSFW just adds it like normal
                    pinEmbed.setDescription(pin.content);
                }
                try {
                    //tries to delay the messages sent when there is a large bulk of message to reduce api abuse
                    setTimeout(() => {
                        delay = delay + 3500;
                        //sends the data to the channel
                        ArchiveChannel.send({ embeds: [pinEmbed] });
                        //console.log(delay);
                    }, delay);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = methods;