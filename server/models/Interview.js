const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    // --- USER & RESUME ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resume",
      required: true,
    },

    // --- INTERVIEW SETTINGS ---
    role: {
      type: String,
      enum: ["Frontend", "Backend", "Fullstack"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // --- INTERVIEW CONTENT ---
    questions: {
      type: [String],
      required: true,
    },

    answers: {
      type: [String],
      default: [],
    },

    // --- RESULT ---
    feedback: String,
    score: {
      type: Number,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Interview", interviewSchema);
