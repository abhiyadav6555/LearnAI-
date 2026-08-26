const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Same student cannot enroll in same course twice
enrollmentSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
);