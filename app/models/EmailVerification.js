const mongoose = require("mongoose");
const validator = require("validator");

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const validation = validator.isEmail(value);
                return validation;
            },
            message: "Invalid Email"
        }
    },

    token: {
        type: String,
        required: true
    },

    id: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    info: {
        REQUESTED_BY: {
            type: String,
            required: false
        },
        USER_SYSTEM_ID: {
            type: String,
            required: false
        }
    },

    status: {
        type: String,
        default: "pending"
    }

})

const Model = mongoose.model("email-verification", Schema);

module.exports = Model;