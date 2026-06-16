const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpire: {
        type: Date,
        required: true,
        expires: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("Otp", otpSchema);