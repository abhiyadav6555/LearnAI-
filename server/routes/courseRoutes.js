const express = require("express");

const router = express.Router();

const {
  getCourses,
  getCourseById,
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// All courses
router.get(
  "/",
  getCourses
);

// My courses
router.get(
  "/my-courses",
  protect,
  authorize("instructor", "admin"),
  getMyCourses
);

// Single course
router.get(
  "/:id",
  getCourseById
);

// Create
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  createCourse
);

// Update
router.put(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  updateCourse
);

// Delete
router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  deleteCourse
);

module.exports = router;