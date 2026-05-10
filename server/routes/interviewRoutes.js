const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  upload,
  generate,
  feedback,
  saveAnswers,
  getAllInterviews,
  getInterviewById,
} = require("../controllers/interviewController");

// --- FILE UPLOAD ---

router.post(
  "/upload",
  isAuthenticated,
  uploadMiddleware.single("resume"),
  upload,
);

// --- INTERVIEW ---

router.post("/generate", isAuthenticated, generate);

router.post("/feedback", isAuthenticated, feedback);

// --- SAVE ANSWERS ---
router.put("/save-answers",isAuthenticated,saveAnswers);

// --- HISTORY ---

router.get("/interviews", isAuthenticated, getAllInterviews);

router.get("/interviews/:id", isAuthenticated, getInterviewById);

module.exports = router;
