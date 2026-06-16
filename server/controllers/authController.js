const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");
const verifyEmailTemplate = require("../utils/emails/verifyEmail");
const resetPasswordTemplate = require("../utils/emails/resetPasswordEmail");

// --- SIGNUP ---
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number and symbol"
      });
    }

    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otpRecord = await Otp.findOne({
      email: email.toLowerCase(),
      isVerified: true
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      credits: 4,
      lastCreditReset: new Date(),
      isVerified: true
    });


    await Otp.findOneAndDelete({
      email: email.toLowerCase()
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
};


// --- SEND OTP ---
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userExists = await User.findOne({
      email: email.toLowerCase()
    })

    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingOtp = await Otp.findOne({
      email: email.toLowerCase()
    });

    if (
      existingOtp &&
      Date.now() - existingOtp.createdAt.getTime() < 60 * 1000
    ) {
      return res.status(400).json({
        message: "Please wait 60 seconds before requesting another OTP"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({
      email: email.toLowerCase()
    });

    await Otp.create({
      email: email.toLowerCase(),
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000
    });

    const template = verifyEmailTemplate(otp);

    await sendMail(
      email,
      template.subject,
      template.html
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error sending OTP"
    });
  }
};

// --- VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase() });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account first" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- LOGOUT ---
exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// --- FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const template = resetPasswordTemplate(otp);

    await sendMail(user.email, template.subject, template.html);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Forgot password" });
  }
};

// --- RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return res.status(400).json({
        message: "Password must contain uppercase, lowercase, number and symbol"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reset password error" });
  }
};
