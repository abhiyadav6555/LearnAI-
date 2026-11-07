
const express = require("express");
const router = express.Router();

const {
  completeLesson,
  getCourseProgress,
} = require("../controllers/progressController");

router.post(
  "/:student/:course/complete",
  completeLesson
);

router.get(
  "/:student/:course",
  getCourseProgress
);

module.exports = router;
