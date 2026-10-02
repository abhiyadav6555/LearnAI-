import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/courses");

        const courseList = response.data.courses || [];

        setCourses(courseList);

        const userId = user?._id || user?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const progressResults = await Promise.all(
          courseList.map(async (course) => {
            try {
              const progressResponse = await API.get(
                "/progress/" +
                  userId +
                  "/" +
                  course._id +
                  "/"
              );

              return {
                courseId: course._id,
                progress:
                  progressResponse.data.progressPercentage || 0,
                completedLessons:
                  progressResponse.data.completedLessons || 0,
              };
            } catch (err) {
              return {
                courseId: course._id,
                progress: 0,
                completedLessons: 0,
              };
            }
          })
        );

        const progressMap = {};

        progressResults.forEach((item) => {
          progressMap[item.courseId] = {
            progress: item.progress,
            completedLessons: item.completedLessons,
          };
        });

        setProgressData(progressMap);
      } catch (err) {
        console.error("STUDENT DASHBOARD ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we prepare your learning space.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">⚠️</div>

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalCourses = courses.length;

  const completedCourses = courses.filter((course) => {
    const progress =
      progressData[course._id]?.progress || 0;

    return progress >= 100;
  }).length;

  const inProgressCourses = courses.filter((course) => {
    const progress =
      progressData[course._id]?.progress || 0;

    return progress > 0 && progress < 100;
  }).length;

  const totalLessonsCompleted = courses.reduce(
    (total, course) => {
      return (
        total +
        (progressData[course._id]?.completedLessons || 0)
      );
    },
    0
  );

  return (
    <div className="page-container dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div>
            <span className="dashboard-badge">
              🎓 Student Dashboard
            </span>

            <h1>
              Welcome back,{" "}
              <span>{user?.name || "Student"}</span> 👋
            </h1>

            <p>
              Continue your learning journey and keep
              building your skills with LearnAI.
            </p>
          </div>

          <Link
            to="/courses"
            className="browse-courses-btn"
          >
            Browse Courses →
          </Link>
        </div>
      </section>

      <main className="dashboard-container">
        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-icon">📚</div>

            <div>
              <span>Total Courses</span>
              <strong>{totalCourses}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🚀</div>

            <div>
              <span>In Progress</span>
              <strong>{inProgressCourses}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🏆</div>

            <div>
              <span>Completed</span>
              <strong>{completedCourses}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">✅</div>

            <div>
              <span>Lessons Done</span>
              <strong>{totalLessonsCompleted}</strong>
            </div>
          </div>
        </section>

        <section className="learning-section">
          <div className="dashboard-section-header">
            <div>
              <span className="section-label">
                MY LEARNING
              </span>

              <h2>Continue Learning</h2>

              <p>
                Pick up where you left off and keep
                making progress.
              </p>
            </div>

            <Link
              to="/courses"
              className="view-all-btn"
            >
              View All Courses →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="dashboard-empty">
              <div>📚</div>

              <h2>No courses available</h2>

              <p>
                Start your learning journey by exploring
                our available courses.
              </p>

              <Link
                to="/courses"
                className="browse-empty-btn"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="dashboard-course-grid">
              {courses.map((course) => {
                const courseProgress =
                  progressData[course._id]?.progress || 0;

                const completedLessons =
                  progressData[course._id]
                    ?.completedLessons || 0;

                const totalLessons =
                  course.lessons?.length || 0;

                const isCompleted =
                  courseProgress >= 100;

                return (
                  <article
                    className="dashboard-course-card"
                    key={course._id}
                  >
                    <div className="dashboard-course-image">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                        />
                      ) : (
                        <div className="dashboard-placeholder">
                          <span>🎓</span>
                          <small>LearnAI</small>
                        </div>
                      )}

                      <span className="dashboard-level">
                        {course.level || "Beginner"}
                      </span>
                    </div>

                    <div className="dashboard-course-content">
                      <div className="dashboard-course-category">
                        {course.category || "General"}
                      </div>

                      <h3>{course.title}</h3>

                      <p>
                        {course.description?.length > 90
                          ? course.description.slice(0, 90) +
                            "..."
                          : course.description}
                      </p>

                      <div className="progress-header">
                        <span>Your Progress</span>

                        <strong>
                          {courseProgress}%
                        </strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width:
                              courseProgress + "%",
                          }}
                        ></div>
                      </div>

                      <div className="course-progress-info">
                        <span>
                          {completedLessons} /{" "}
                          {totalLessons} lessons
                        </span>

                        {isCompleted ? (
                          <span className="completed-label">
                            ✓ Completed
                          </span>
                        ) : (
                          <span>
                            {courseProgress > 0
                              ? "In Progress"
                              : "Not Started"}
                          </span>
                        )}
                      </div>

                      <div className="dashboard-course-footer">
                        <span className="dashboard-price">
                          {course.price > 0
                            ? "₹" + course.price
                            : "Free"}
                        </span>

                        <Link
                          to={`/courses/${course._id}`}
                          className="continue-btn"
                        >
                          {isCompleted
                            ? "Review Course"
                            : courseProgress > 0
                            ? "Continue Learning"
                            : "Start Learning"}
                          <span>→</span>
                        </Link>
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

export default StudentDashboard;