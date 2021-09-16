const { Schema, model} = require("mongoose");

const GuildSchema = Schema({
    id: { type: String, required: true, immutable: true, unique: true },      //This doesn't change and is required to look it up.
    creationDate: { type: Number, required: true, immutable: true },
    prefix: { type: String, lowercase: true, trim: true, minLength: 1, maxLength: 6, default: "m!" },   //Sets the prefix and make sure it isn't something stupid
    pinArchive: {
        enabled: { type: Boolean, default: true },
        channel: { type: String, required: true, default: "pin-archive" },
        autoRemove: { type: Boolean, default: true },
        archiveAll: { type: Boolean, default: false },
        reaction: {
            enabled: { type: Boolean, default: true },
            count: { type: Number, default: 7 },
            emoji: { type: String, default: "📌"}
        },
    }
});

module.exports = model("GuildData", GuildSchema);