const mongoose = require("mongoose");

const Schema = new mongoose.Schema({

    refreshToken: {
        type: String,
        required: true,
    },

    accessToken: {
        type: String,
        required: true,
    },

    token: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: () => { return new Date() },
    },

    status: {
        type: String,
        default: "usable"
    }

})

const Model = mongoose.model("token-storage", Schema);

module.exports = Model;