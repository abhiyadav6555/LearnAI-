
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// PROTECT ROUTES
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// OPTIONAL AUTHENTICATION
const optionalProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log(
      "COURSE AUTH HEADER:",
      authHeader ? "TOKEN RECEIVED" : "TOKEN MISSING"
    );

    if (!authHeader) {
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    console.log("COURSE AUTH USER:", user._id, user.role);

    next();
  } catch (error) {
    console.error("OPTIONAL AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ROLE AUTHORIZATION
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this action",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorize,
};
