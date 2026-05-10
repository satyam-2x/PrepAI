const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // --- USER REFERENCE ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // --- RESUME DATA ---
    text: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", resumeSchema);
