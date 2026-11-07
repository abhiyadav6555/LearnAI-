
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// GET ALL COURSES
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    const publicCourses = courses.map((course) => {
      const courseData = course.toObject();
      courseData.lessonCount = course.lessons.length;
      courseData.lessons = [];
      return courseData;
    });

    res.status(200).json({
      success: true,
      courses: publicCourses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE COURSE

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

    const userId = req.user?._id?.toString();

    const enrollment = userId
      ? await Enrollment.findOne({
          student: userId,
          course: course._id,
        })
      : null;

    const studentInCourse = userId
      ? course.students.some(
          (studentId) => studentId.toString() === userId
        )
      : false;

    const isEnrolled = Boolean(enrollment || studentInCourse);

    const isInstructor = Boolean(
      userId &&
      req.user.role === "instructor" &&
      course.instructor._id.toString() === userId
    );

    const isAdmin = req.user?.role === "admin";

    const hasLessonAccess =
      isEnrolled || isInstructor || isAdmin;

    console.log("COURSE ID:", course._id.toString());
    console.log("STUDENT ID:", userId);
    console.log("ENROLLMENT RECORD:", Boolean(enrollment));
    console.log("STUDENT IN COURSE:", studentInCourse);
    console.log("LESSON ACCESS:", hasLessonAccess);

    const courseData = course.toObject();

    courseData.lessonCount = course.lessons.length;
    courseData.hasLessonAccess = hasLessonAccess;

    if (!hasLessonAccess) {
      courseData.lessons = [];
    }

    res.status(200).json({
      success: true,
      course: courseData,
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

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level: level || "Beginner",
      price: Number(price) || 0,
      thumbnail: thumbnail || "",
      lessons: lessons || [],
      instructor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET INSTRUCTOR COURSES
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("GET MY COURSES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ENROLL IN COURSE
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const studentId = req.user._id;

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: course._id,
    });

    const alreadyEnrolled = course.students.some(
      (id) => id.toString() === studentId.toString()
    );

    if (existingEnrollment || alreadyEnrolled) {
      if (!alreadyEnrolled) {
        course.students.push(studentId);
        await course.save();
      }

      if (!existingEnrollment) {
        await Enrollment.create({
          student: studentId,
          course: course._id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "You are already enrolled in this course",
      });
    }

    course.students.push(studentId);
    await course.save();

    await Enrollment.create({
      student: studentId,
      course: course._id,
    });

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
      course,
    });
  } catch (error) {
    console.error("ENROLL COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET STUDENT ENROLLED COURSES
const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      students: req.user._id,
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("GET ENROLLED COURSES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
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
      { new: true, runValidators: true }
    ).populate("instructor", "name email");

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
  getMyCourses,
  getEnrolledCourses,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
