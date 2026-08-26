const Course = require("../models/Course");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses: courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      thumbnail,
      lessons,
      instructor,
    } = req.body;

    if (!title || !description || !category || !instructor) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and instructor are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level: level || "Beginner",
      price: price || 0,
      thumbnail: thumbnail || "",
      lessons: lessons || [],
      instructor,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      courses,
    });

  } catch (error) {
    console.error(
      "GET MY COURSES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Only course instructor or admin can update
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Only course instructor or admin can delete
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this course",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
};