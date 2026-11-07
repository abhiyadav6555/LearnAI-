
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/courses/my-courses");
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Instructor Dashboard Error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(courseId);
      await API.delete(`/courses/${courseId}`);

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to delete course."
      );
    } finally {
      setDeleting("");
    }
  };

  const totalLessons = courses.reduce(
    (total, course) => total + (course.lessons?.length || 0),
    0
  );

  const totalStudents = courses.reduce(
    (total, course) =>
      total +
      (Array.isArray(course.students)
        ? course.students.length
        : Number(course.students) || 0),
    0
  );

  if (loading) {
    return (
      <div className="instructor-dashboard">
        <div className="instructor-state">
          <div className="loading-spinner"></div>
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-dashboard">
        <div className="instructor-state">
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchCourses}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <section className="instructor-hero">
        <div className="instructor-hero-content">
          <div>
            <span className="instructor-badge">
              🎓 INSTRUCTOR DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <span>{user?.name || "Instructor"}</span> 👋
            </h1>

            <p>
              Manage your courses, share knowledge and
              inspire students to learn.
            </p>
          </div>

          <Link to="/create-course" className="create-course-btn">
            + Create New Course
          </Link>
        </div>
      </section>

      <main className="instructor-container">
        <section className="instructor-stats">
          <div className="instructor-stat-card">
            <span>📚</span>
            <div>
              <p>Total Courses</p>
              <strong>{courses.length}</strong>
            </div>
          </div>

          <div className="instructor-stat-card">
            <span>👨‍🎓</span>
            <div>
              <p>Total Students</p>
              <strong>{totalStudents}</strong>
            </div>
          </div>

          <div className="instructor-stat-card">
            <span>📖</span>
            <div>
              <p>Total Lessons</p>
              <strong>{totalLessons}</strong>
            </div>
          </div>
        </section>

        <section className="instructor-courses-section">
          <div className="instructor-section-header">
            <div>
              <span className="instructor-label">
                COURSE MANAGEMENT
              </span>
              <h2>My Courses</h2>
              <p>Manage and organize your learning content.</p>
            </div>

            <Link to="/create-course" className="instructor-add-btn">
              + Add Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="instructor-empty">
              <div>📚</div>
              <h2>No Courses Created Yet</h2>
              <p>
                Start sharing your knowledge by creating your
                first course.
              </p>
              <Link to="/create-course" className="create-course-btn">
                Create Your First Course →
              </Link>
            </div>
          ) : (
            <div className="instructor-course-grid">
              {courses.map((course) => {
                const studentCount = Array.isArray(course.students)
                  ? course.students.length
                  : Number(course.students) || 0;

                return (
                  <article
                    className="instructor-course-card"
                    key={course._id}
                  >
                    <div className="instructor-course-image">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                        />
                      ) : (
                        <div className="instructor-placeholder">
                          🎓
                          <small>LearnAI</small>
                        </div>
                      )}

                      <span>
                        {course.level || "Beginner"}
                      </span>
                    </div>

                    <div className="instructor-course-content">
                      <span className="instructor-category">
                        {course.category || "General"}
                      </span>

                      <h3>{course.title}</h3>

                      <p>
                        {course.description?.length > 100
                          ? `${course.description.slice(0, 100)}...`
                          : course.description}
                      </p>

                      <div className="instructor-course-info">
                        <span>
                          📖 {course.lessons?.length || 0} Lessons
                        </span>
                        <span>
                          👨‍🎓 {studentCount} Students
                        </span>
                      </div>

                      <div className="instructor-course-footer">
                        <strong>
                          {course.price > 0
                            ? `₹${course.price}`
                            : "Free"}
                        </strong>

                        <div className="instructor-actions">
                          <Link
                             to={`/courses/${course._id}`}
                             className="manage-course-btn"
                         >
                           View
                          </Link>

                          <Link
                            to={`/edit-course/${course._id}`}
                            className="edit-course-btn"
                        >
                            Edit
                          </Link>

                          <button
                            className="delete-course-btn"
                            onClick={() => handleDelete(course._id)}
                            disabled={deleting === course._id}
                          >
                            {deleting === course._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default InstructorDashboard;
