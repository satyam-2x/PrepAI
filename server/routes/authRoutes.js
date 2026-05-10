const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyOtp
} = require("../controllers/authController");

// --- AUTH ROUTES ---

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

// --- PASSWORD ROUTES ---

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;