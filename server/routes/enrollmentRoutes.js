const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");

// ===============================
// ENROLL STUDENT IN COURSE
// ===============================
router.post("/", async (req, res) => {
  try {
    const { student, course } = req.body;

    // Check required fields
    if (!student || !course) {
      return res.status(400).json({
        success: false,
        message: "Student and course are required",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student,
      course,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student,
      course,
      progress: 0,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("ENROLLMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// GET STUDENT ENROLLMENTS
// ===============================
router.get("/student/:studentId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.studentId,
    })
      .populate("course")
      .populate("student", "name email");

    res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;