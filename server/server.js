const express = require("express");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Config
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);

// Connect database
connectDB();

// --- MIDDLEWARE ---

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://prep-ai-pi-two.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());

// Prevent API abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
});

app.use("/api", limiter);

// --- ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/profile", profileRoutes);

// --- SERVER ---

// app.listen(PORT, () => {
//     console.log(`Server running on ${PORT}`);
// });

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});