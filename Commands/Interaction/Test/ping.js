module.exports = {
    name: "ping",
    description: "Replies with a pong!",
    userPermissions: [],
    botPermissions: [],
    async execute(interaction) {
        await interaction.reply("Pong!");
    }
};