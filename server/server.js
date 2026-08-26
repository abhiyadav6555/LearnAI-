const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const enrollmentRoutes = require("./routes/enrollmentRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const app = express();
const progressRoutes = require(
  "./routes/progressRoutes"
);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/enrollments", enrollmentRoutes);
app.use(
  "/api/progress",
  progressRoutes
);

// Test route
app.get("/", (req, res) => {
  res.send("LearnAI Server is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);
  });