const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  deleteAccount,
  changePassword,
} = require("../controllers/profileController");

// --- PROFILE ---

router.get("/", isAuthenticated, getProfile);
router.put("/", isAuthenticated, updateProfile);
router.delete("/", isAuthenticated, deleteAccount);

// --- SECURITY ---

router.put("/change-password", isAuthenticated, changePassword);

module.exports = router;
