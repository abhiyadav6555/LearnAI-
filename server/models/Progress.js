const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
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

    completedLessons: {
      type: [Number],
      default: [],
    },

    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Progress",
  progressSchema
);