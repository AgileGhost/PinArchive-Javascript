const { Schema, model } = require("mongoose");

const ChannelSchema = Schema({
    id: { type: String, required: true, immutable: true, unique: true },      //This doesn't change and is required to look it up.
    guildID: { type: String, required: true, immutable: true },      //This doesn't change and is required to look it up.
    creationDate: { type: Number, required: true, immutable: true },
    pinArchive: {
        private: { type: Boolean, default: false },
        pinnedMessages: { type: Array, default: [] },
        reactionPin: { type: Boolean, default: true },
        enabled: { type: Boolean, default: true },
        LastPinnedID: { type: String, default: "0000000" }
    }

});

module.exports = model("ChannelData", ChannelSchema);