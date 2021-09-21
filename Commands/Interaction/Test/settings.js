const { MessageEmbed } = require("discord.js");
const GuildData = require("../../../Models/GuildData");

module.exports = {
    name: "settings",
    description: "Change or view settings of the bot",
    userPermissions: [],        //There is no need to have permissions since its just viewing the settings
    botPermissions: [],
    async execute(interaction) {
        //Grabs guild data
        GuildData.findOne({ id: interaction.guild.id }, async (err, Gdata) => {
            //Embed structure builder
            let SettingsEmbed = new MessageEmbed()
                //Tells the user to go to the message based command to change
                .setDescription("**Settings**\n\nTo change settings please use the message command `" + Gdata.prefix + "settings`\nNOTE: Only autoremove, `reactions`, `reactioncount` and `archiveall` can be changed!")
                .addField("Prefix: ", `${Gdata.prefix}`, true)  //The prefix to execute a command
                .addField("AutoRemove: ", `${Gdata.pinArchive.autoRemove}`, true) 
                .addField("Reactions ", "Enabled: " + `${Gdata.pinArchive.reaction.enabled}`, true)
                .addField("Reaction Count", `${Gdata.pinArchive.reaction.count}`, true)
                .addField("Reaction Emoji:", `${Gdata.pinArchive.reaction.emoji}`, true)
                .addField("ArchiveAll: ", `${Gdata.pinArchive.archiveAll}` + "\n`Experimental: Archives all previous pins, not archived before`")
                .setFooter("id: " + `${interaction.guild.id}`);
            //sends it as a message that only the person executing the command can see
            await interaction.reply({ embeds: [SettingsEmbed], ephemeral: true });
        });
    }
};