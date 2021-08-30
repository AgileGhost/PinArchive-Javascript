module.exports = {
    name: "respond",
    description: "Replies with a pong!",
    interaction: true,
    async execute(interaction) {
        await interaction.reply("Pong!");
    }
};