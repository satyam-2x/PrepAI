const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- BASIC INFO ---
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      match: [/(?=.*[!@#$%^&*])/, "Password must contain at least 1 symbol"],
    },

    // --- PASSWORD RESET ---
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },

    // --- EMAIL VERIFICATION ---
    otp: String,
    otpExpiry: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },

    // --- USER CREDITS ---
    credits: {
      type: Number,
      default: 4,
    },

    lastCreditReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
