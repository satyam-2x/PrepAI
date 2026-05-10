const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const Interview = require("../models/Interview");
const User = require("../models/User");
const Resume = require("../models/Resume");
const crypto = require("crypto");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// --- UPLOAD RESUME ---
exports.upload = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const data = await pdfParse(req.file.buffer);

    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ message: "Empty resume" });
    }

    const hash = crypto.createHash("sha256").update(data.text).digest("hex");

    const existing = await Resume.findOne({ userId, hash });

    if (existing) {
      return res.status(200).json({
        message: "Resume already uploaded",
        resumeId: existing._id,
      });
    }

    const resume = await Resume.create({
      userId,
      text: data.text,
      hash,
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeId: resume._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload error" });
  }
};

exports.generate = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    let { resumeId, role, difficulty, query } = req.body;

    role = role || "Frontend";
    difficulty = difficulty || "Easy";
    query = query || "";

    if (!resumeId) {
      return res.status(400).json({ message: "Resume required" });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const text = resume.text;

    const lastInterview = await Interview.findOne({
      userId,
      resumeId,
    }).sort({ createdAt: -1 });

    if (
      lastInterview &&
      Date.now() - new Date(lastInterview.createdAt).getTime() < 5000
    ) {
      return res.status(200).json({
        interviewId: lastInterview._id,
        questions: lastInterview.questions,
        credits: user.credits,
      });
    }

    const today = new Date().toDateString();

    const lastReset = user.lastCreditReset
      ? new Date(user.lastCreditReset).toDateString()
      : null;

    if (!lastReset || today !== lastReset) {
      user.credits = 4;
      user.lastCreditReset = new Date();
    }

    if (user.credits <= 0) {
      return res.status(400).json({ message: "No credits left for today" });
    }

    const prompt = `
You are a strict and professional Technical Interviewer.

TASK:
Generate exactly 5 interview questions.

INPUT:
- Role: ${role}
- Difficulty: ${difficulty}
- Candidate Focus: ${query}

RULES:
- Questions MUST be based ONLY on the resume
- Focus on real-world, practical scenarios
- Avoid generic textbook questions

DIFFICULTY:
- Easy:
  - Basic definitions or usage
  - No "why", "how", or scenario questions
- Medium:
  - Concept + implementation mix
- Hard:
  - Deep concepts, system design, trade-offs

STRICT OUTPUT FORMAT:
- Only questions
- Exactly 5
- One per line
- No numbering, no bullets
- No extra text

RESUME:
${text.replace(/\s+/g, " ").slice(0, 3500)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const raw = response.text || "";

    const questions = raw
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 10)
      .slice(0, 5);

    if (questions.length !== 5) {
      return res.status(500).json({ message: "AI response error" });
    }

    user.credits -= 1;
    await user.save();

    const interview = await Interview.create({
      userId,
      resumeId,
      role,
      difficulty,
      questions,
      answers: [],
      status: "incomplete",
    });

    res.status(200).json({
      interviewId: interview._id,
      questions,
      credits: user.credits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
};

// --- GENERATE FEEDBACK ---
exports.feedback = async (req, res) => {
  try {
    const { interviewId, questions, answers } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID required" });
    }

    if (!questions || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Answers required" });
    }

    const combined = questions
      .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || ""}`)
      .join("\n\n");

    const prompt = `
You are a strict and helpful Technical Interviewer.

TASK:
Evaluate the candidate's answers deeply and give constructive feedback.

EVALUATION CRITERIA:
- Technical accuracy
- Clarity of explanation
- Depth of understanding
- Problem-solving approach

OUTPUT FORMAT (STRICT):

Score: X/10

Strengths:
- point 1
- point 2

Weaknesses:
- point 1
- point 2

Improvements:
- point 1 (actionable)
- point 2 (actionable)

RULES:
- Keep language simple and direct
- Be honest but not harsh
- Do NOT add extra paragraphs
- Focus on helping candidate improve

DATA:
${combined}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const feedbackText = (response.text || "").replace(/[*#]/g, "").trim();

    const match = feedbackText.match(/Score:\s*(\d+)/);
    const extractedScore = match ? Number(match[1]) : null;

    await Interview.findByIdAndUpdate(interviewId, {
      answers,
      feedback: feedbackText,
      score: extractedScore,
      status: "completed",
    });

    res.status(200).json({
      feedback: feedbackText,
      score: extractedScore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
};

// --- SAVE INTERVIEW ANSWERS ---
exports.saveAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.answers = answers;

    await interview.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Save failed" });
  }
};

// --- GET ALL INTERVIEWS ---
exports.getAllInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const today = new Date().toDateString();

    const lastReset = user.lastCreditReset
      ? new Date(user.lastCreditReset).toDateString()
      : null;

    if (!lastReset || today !== lastReset) {
      user.credits = 4;
      user.lastCreditReset = new Date();

      await user.save();
    }

    const interviews = await Interview.find({ userId })
      .select("_id role difficulty createdAt status score")
      .sort({ createdAt: -1 });

    res.status(200).json({
      interviews,
      credits: user.credits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching interviews" });
  }
};

// --- GET INTERVIEW BY ID ---
exports.getInterviewById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId,
    });

    if (!interview) {
      return res.status(400).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching interview" });
  }
};
