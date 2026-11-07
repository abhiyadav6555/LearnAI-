
const Progress = require("../models/Progress");
const Course = require("../models/Course");

const completeLesson = async (req, res) => {
  try {
    const student =
      req.params.student ||
      req.body.student ||
      req.user?._id ||
      req.user?.id;

    const course =
      req.params.course ||
      req.body.course;

    const lessonIndex = Number(req.body.lessonIndex);

    if (
      !student ||
      !course ||
      req.body.lessonIndex === undefined ||
      !Number.isInteger(lessonIndex) ||
      lessonIndex < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student, course or lessonIndex",
      });
    }

    const courseData = await Course.findById(course);

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons = courseData.lessons?.length || 0;

    if (totalLessons === 0 || lessonIndex >= totalLessons) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson index",
      });
    }

    let progress = await Progress.findOne({
      student,
      course,
    });

    if (!progress) {
      progress = new Progress({
        student,
        course,
        completedLessons: [],
        progressPercentage: 0,
      });
    }

    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    progress.progressPercentage = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Lesson completed successfully",
      progress,
    });
  } catch (error) {
    console.error("COMPLETE LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { student, course } = req.params;

    const progress = await Progress.findOne({
      student,
      course,
    });

    return res.status(200).json({
      success: true,
      progress: progress || {
        completedLessons: [],
        progressPercentage: 0,
      },
    });
  } catch (error) {
    console.error("GET PROGRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  completeLesson,
  getCourseProgress,
};
