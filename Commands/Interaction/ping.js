module.exports = {
    name: "ping",
    description: "Replies with a pong!",
    category: "",
    cooldown: 1,
    interaction: true,
    global: false,
    userPermissions: [],
    botPermissions: [],
    async execute(interaction) {
        await interaction.reply("Pong!");
    }
};