const express = require("express");

const router = express.Router();

const {
  completeLesson,
  getCourseProgress,
} = require("../controllers/progressController");

// Mark lesson completed
router.post(
  "/complete",
  completeLesson
);

// Get progress
router.get(
  "/:student/:course",
  getCourseProgress
);

module.exports = router;