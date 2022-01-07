const mongoose = require("mongoose");
const validator = require("validator");

const Schema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const validation = validator.isAlphanumeric(value);
                return validation;
            },
            message: "Username must be alphanumeric"
        },
    },

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

    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: () => { return new Date() }
    },

    createdBy: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const validation = validator.isIP(value);
                return validation;
            },
            message: "createdBy must IP address"
        }
    },

    id: {
        type: String,
        required: true
    },

    'verification.email': {
        verified: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            required: false,
            default: null
        }
    },

    'verification.phone': {
        verified: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            required: false,
            default: null
        }
    },

    'settings': {
        MAX_ACTIVE_LOGINS: {
            type: Number,
            default: 3
        },
    },

    info: {
        USER_SYSTEM_ID: {
            type: String,
            required: false
        }
    }

})

const Model = mongoose.model("user", Schema);

module.exports = Model;