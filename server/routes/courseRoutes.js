const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourseById,
  getMyCourses,
  getEnrolledCourses,
  enrollCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  protect,
  optionalProtect,
  authorize,
} = require("../middleware/authMiddleware");

router.get("/", getCourses);

router.get(
  "/my-courses",
  protect,
  authorize("instructor", "admin"),
  getMyCourses
);

router.get(
  "/enrolled",
  protect,
  authorize("student"),
  getEnrolledCourses
);

router.post(
  "/:id/enroll",
  protect,
  authorize("student"),
  enrollCourse
);

router.get("/:id", optionalProtect, getCourseById);

router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  createCourse
);

router.put(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  deleteCourse
);

module.exports = router;