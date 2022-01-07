const mongoose = require("mongoose");

const Schema = new mongoose.Schema({

    refreshToken: {
        type: String,
        required: true,
    },

    token: {
        type: String,
        required: true,
    },

    id: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: () => { return new Date() },
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        default: "usable"
    }

})

const Model = mongoose.model("refresh-token", Schema);

module.exports = Model;