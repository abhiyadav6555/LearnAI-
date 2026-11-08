
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { verifyFirebaseToken } = require("../config/firebaseAdmin");

const router = express.Router();

// Normalize Indian and international phone numbers
const normalizePhone = (value) => {
  if (!value) return null;

  let phone = String(value).trim().replace(/[\s()-]/g, "");

  if (/^\d{10}$/.test(phone)) {
    phone = "+91" + phone;
  } else if (/^91\d{10}$/.test(phone)) {
    phone = "+" + phone;
  }

  return /^\+\d{10,15}$/.test(phone) ? phone : null;
};

// REGISTER - WITHOUT OTP
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const requestedRole = req.body.role || "student";
    const mobileNumber = normalizePhone(req.body.mobileNumber);

    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile number and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 6 to 128 characters",
      });
    }

    if (!["student", "instructor"].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      role: requestedRole,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register right now",
    });
  }
});

// LOGIN - EMAIL OR MOBILE NUMBER + PASSWORD
router.post("/login", async (req, res) => {
  try {
    const identifier = String(
      req.body.identifier ||
      req.body.email ||
      req.body.mobileNumber ||
      ""
    ).trim();

    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile number and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured",
      });
    }

    let user;

    if (identifier.includes("@")) {
      user = await User.findOne({
        email: identifier.toLowerCase(),
      });
    } else {
      const mobileNumber = normalizePhone(identifier);

      if (!mobileNumber) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid email or mobile number",
        });
      }

      user = await User.findOne({ mobileNumber });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile number or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login right now",
    });
  }
});

// RESET PASSWORD - VERIFIED FIREBASE PHONE REQUIRED
router.post("/reset-password", async (req, res) => {
  try {
    const { idToken, newPassword } = req.body;

    if (!idToken || typeof newPassword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Phone verification and new password are required",
      });
    }

    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 6 to 128 characters",
      });
    }

    const decodedToken = await verifyFirebaseToken(idToken);
    const mobileNumber = normalizePhone(decodedToken.phone_number);

    if (!mobileNumber) {
      return res.status(401).json({
        success: false,
        message: "Phone verification failed",
      });
    }

    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unable to reset password for this number",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Phone verification failed or OTP session expired",
    });
  }
});

module.exports = router;
