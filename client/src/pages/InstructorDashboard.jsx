import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const fetchMyCourses = async () => {
    try {
      setLoading(true);

      const response = await API.get("/courses/my-courses");

      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("MY COURSES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await API.delete(
        `/courses/${courseId}`
      );

      if (response.data.success) {
        alert("Course deleted successfully!");
        fetchMyCourses();
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const totalStudents = courses.reduce(
    (total, course) =>
      total + (course.students?.length || 0),
    0
  );

  return (
    <div className="instructor-dashboard">
      <section className="instructor-hero">
        <div className="instructor-hero-content">
          <span className="dashboard-badge">
            🎓 Instructor Dashboard
          </span>

          <h1>
            Welcome back,{" "}
            <span>
              {user?.name || "Instructor"}
            </span>
            👋
          </h1>

          <p>
            Manage your courses, share your
            knowledge, and help students learn
            new skills.
          </p>

          <Link
            to="/create-course"
            className="create-course-btn"
          >
            + Create New Course
          </Link>
        </div>

        <div className="instructor-hero-icon">
          🎓
        </div>
      </section>

      <section className="instructor-stats">
        <div className="instructor-stat-card">
          <div className="stat-icon">📚</div>

          <div>
            <span>Total Courses</span>
            <strong>{courses.length}</strong>
          </div>
        </div>

        <div className="instructor-stat-card">
          <div className="stat-icon">👨‍🎓</div>

          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
        </div>

        <div className="instructor-stat-card">
          <div className="stat-icon">🚀</div>

          <div>
            <span>Published Courses</span>
            <strong>{courses.length}</strong>
          </div>
        </div>
      </section>

      <section className="instructor-courses-section">
        <div className="instructor-section-header">
          <div>
            <span className="section-label">
              COURSE MANAGEMENT
            </span>

            <h2>My Courses</h2>

            <p>
              Manage and monitor all your
              created courses.
            </p>
          </div>

          <Link
            to="/create-course"
            className="section-create-btn"
          >
            + Add Course
          </Link>
        </div>

        {loading ? (
          <div className="instructor-loading">
            <div className="loading-spinner"></div>
            <p>Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="instructor-empty">
            <div className="empty-course-icon">
              📚
            </div>

            <h2>No courses yet</h2>

            <p>
              You haven't created any courses.
              Start sharing your knowledge with
              students today.
            </p>

            <Link
              to="/create-course"
              className="empty-create-btn"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="instructor-course-grid">
            {courses.map((course) => (
              <article
                className="instructor-course-card"
                key={course._id}
              >
                <div className="instructor-course-top">
                  <span className="course-category-badge">
                    {course.category ||
                      "General"}
                  </span>

                  <span className="course-level-badge">
                    {course.level ||
                      "Beginner"}
                  </span>
                </div>

                <div className="instructor-course-icon">
                  🎓
                </div>

                <h3>{course.title}</h3>

                <p className="instructor-course-description">
                  {course.description?.length > 120
                    ? `${course.description.slice(
                        0,
                        120
                      )}...`
                    : course.description}
                </p>

                <div className="instructor-course-info">
                  <div>
                    <span>Lessons</span>
                    <strong>
                      {course.lessons?.length || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Students</span>
                    <strong>
                      {course.students?.length || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Price</span>
                    <strong>
                      {course.price > 0
                        ? `₹${course.price}`
                        : "Free"}
                    </strong>
                  </div>
                </div>

                <div className="instructor-course-actions">
                  <Link
                    to={`/courses/${course._id}`}
                    className="course-view-btn"
                  >
                    View Course →
                  </Link>

                  <button
                    type="button"
                    className="course-delete-btn"
                    onClick={() =>
                      handleDelete(course._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default InstructorDashboard;