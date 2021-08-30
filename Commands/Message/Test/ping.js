module.exports = {
    name: "ping",
    description: "Replies with a pong!",
    userPermissions: [],
    botPermissions: [],
    async execute(message, args) {
        message.channel.send("Pong!");
    }
};