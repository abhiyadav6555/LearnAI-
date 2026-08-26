const Progress = require("../models/Progress");
const Course = require("../models/Course");

// ==========================================
// MARK LESSON AS COMPLETED
// ==========================================

const completeLesson = async (req, res) => {
  try {
    const {
      student,
      course,
      lessonIndex,
    } = req.body;

    if (
      !student ||
      !course ||
      lessonIndex === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "student, course and lessonIndex are required",
      });
    }

    // Find course
    const courseData =
      await Course.findById(course);

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons =
      courseData.lessons?.length || 0;

    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message:
          "This course has no lessons",
      });
    }

    // Check lesson index
    if (
      lessonIndex < 0 ||
      lessonIndex >= totalLessons
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson index",
      });
    }

    // Find existing progress
    let progress =
      await Progress.findOne({
        student,
        course,
      });

    // Create progress if doesn't exist
    if (!progress) {
      progress = new Progress({
        student,
        course,
        completedLessons: [],
        progressPercentage: 0,
      });
    }

    // Add lesson only once
    if (
      !progress.completedLessons.includes(
        Number(lessonIndex)
      )
    ) {
      progress.completedLessons.push(
        Number(lessonIndex)
      );
    }

    // Calculate percentage
    progress.progressPercentage =
      Math.round(
        (progress.completedLessons.length /
          totalLessons) *
          100
      );

    await progress.save();

    return res.status(200).json({
      success: true,
      message:
        "Lesson completed successfully",
      progress,
    });
  } catch (error) {
    console.error(
      "COMPLETE LESSON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET STUDENT COURSE PROGRESS
// ==========================================

const getCourseProgress = async (
  req,
  res
) => {
  try {
    const { student, course } =
      req.params;

    const progress =
      await Progress.findOne({
        student,
        course,
      });

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          completedLessons: [],
          progressPercentage: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "GET PROGRESS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  completeLesson,
  getCourseProgress,
};