const { Schema, model} = require("mongoose");

const GuildSchema = Schema({
    id: { type: String, required: true, immutable: true, unique: true },      //This doesn't change and is required to look it up.
    creationDate: {type: Number, required: true, immutable: true},
    prefix: { type: String, lowercase: true, trim: true, minLength: 1, maxLength: 6, default: "m!" },   //Sets the prefix and make sure it isn't something stupid
    pinArchive: {
        enabled: { type: Boolean, default: true },
        channel: { type: String, required: true }
    }

});

module.exports = model("GuildData", GuildSchema);