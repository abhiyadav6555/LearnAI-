const Course = require("../models/Course");

// GET ALL COURSES

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
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

// GET SINGLE COURSE BY ID

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

    res.status(200).json({
      success: true,
      course: course,
    });

  } catch (error) {
    console.error("GET COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE COURSE

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
    } = req.body;

    // VALIDATION

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and category are required",
      });
    }

    // CHECK LOGGED-IN USER

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // CREATE COURSE

    const course = await Course.create({

      title: title.trim(),

      description: description.trim(),

      category: category.trim(),

      level: level || "Beginner",

      price: Number(price) || 0,

      thumbnail: thumbnail || "",

      lessons: lessons || [],

      // IMPORTANT:
      // Instructor automatically comes
      // from logged-in user
      instructor: req.user._id,

    });

    // SUCCESS RESPONSE

    res.status(201).json({
      success: true,

      message: "Course created successfully",

      course: course,
    });


  } catch (error) {

    console.error(
      "CREATE COURSE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY COURSES

const getMyCourses = async (req, res) => {
  try {

    // Check authentication

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }


    const courses = await Course.find({
      instructor: req.user._id,
    })
      .populate("instructor", "name email")
      .sort({
        createdAt: -1,
      });


    res.status(200).json({
      success: true,
      courses: courses,
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

    const course = await Course.findById(
      req.params.id
    );


    // Course not found

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // CHECK OWNER
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this course",
      });
    }

    // UPDATE COURSE

    const updatedCourse =
      await Course.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true,
        }

      ).populate(
        "instructor",
        "name email"
      );


    res.status(200).json({
      success: true,

      message:
        "Course updated successfully",

      course: updatedCourse,
    });


  } catch (error) {

    console.error(
      "UPDATE COURSE ERROR:",
      error
    );

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

    const course = await Course.findById(
      req.params.id
    );


    // Course not found

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // CHECK OWNER

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this course",
      });
    }

    // DELETE

    await Course.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({
      success: true,

      message:
        "Course deleted successfully",
    });


  } catch (error) {

    console.error(
      "DELETE COURSE ERROR:",
      error
    );

    res.status(500).json({
      success: false,

      message: "Server error",

      error: error.message,
    });
  }
};

// EXPORT ALL FUNCTIONS

module.exports = {

  getCourses,

  getCourseById,

  createCourse,

  getMyCourses,

  updateCourse,

  deleteCourse,

};