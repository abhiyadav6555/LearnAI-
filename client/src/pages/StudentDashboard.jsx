
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const userId = user?._id || user?.id;

        if (!userId) {
          setError("Please login again to view your dashboard.");
          return;
        }

        // Fetch only enrolled courses
        const response = await API.get("/courses/enrolled");
        const courseList = response.data.courses || [];

        // Fetch progress for enrolled courses
        const results = await Promise.all(
          courseList.map(async (course) => {
            try {
              const res = await API.get(
                `/progress/${userId}/${course._id}/`
              );

              const savedProgress = res.data.progress || {};
              const completedList = Array.isArray(
                savedProgress.completedLessons
              )
                ? savedProgress.completedLessons
                : [];

              return {
                id: course._id,
                progress: Number(savedProgress.progressPercentage) || 0,
                completedLessons: completedList,
                completed: completedList.length,
              };
            } catch (err) {
              console.error(
                `Progress error for course ${course._id}:`,
                err
              );

              return {
                id: course._id,
                progress: 0,
                completedLessons: [],
                completed: 0,
              };
            }
          })
        );

        const progressMap = {};

        results.forEach((item) => {
          progressMap[item.id] = item;
        });

        setCourses(courseList);
        setProgressData(progressMap);
      } catch (err) {
        console.error("Dashboard Error:", err);
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
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <h2>Preparing Your Dashboard</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">⚠️</div>
          <h2>Dashboard Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter((course) => {
    const completed = progressData[course._id]?.completed || 0;
    const lessonCount = course.lessons?.length || 0;

    return lessonCount > 0 && completed >= lessonCount;
  }).length;

  const inProgressCourses = courses.filter((course) => {
    const progress = progressData[course._id]?.progress || 0;
    return progress > 0 && progress < 100;
  }).length;

  const totalLessons = courses.reduce(
    (total, course) => total + (course.lessons?.length || 0),
    0
  );

  const completedLessons = courses.reduce(
    (total, course) =>
      total + (progressData[course._id]?.completed || 0),
    0
  );

  const averageProgress = courses.length
    ? Math.round(
        courses.reduce(
          (total, course) =>
            total + (progressData[course._id]?.progress || 0),
          0
        ) / courses.length
      )
    : 0;

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div>
            <span className="dashboard-badge">
              🎓 STUDENT DASHBOARD
            </span>

            <h1>
              Welcome back, <span>{user?.name || "Student"}</span> 👋
            </h1>

            <p>
              Keep learning, improve your skills and achieve your goals
              with LearnAI.
            </p>
          </div>

          <Link to="/courses" className="browse-courses-btn">
            Explore Courses →
          </Link>
        </div>
      </section>

      <main className="dashboard-container">
        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-icon">📚</div>
            <div>
              <span>Enrolled Courses</span>
              <strong>{courses.length}</strong>
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
              <span>Completed Courses</span>
              <strong>{completedCourses}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <span>Lessons Completed</span>
              <strong>{completedLessons}</strong>
            </div>
          </div>
        </section>

        <section className="learning-section">
          <div className="dashboard-overview">
            <div>
              <span className="section-label">YOUR PERFORMANCE</span>
              <h2>Learning Overview</h2>
              <p>Track your overall learning progress.</p>
            </div>

            <div className="overall-progress">
              <strong>{averageProgress}%</strong>
              <span>Average Progress</span>
            </div>
          </div>

          <div className="overall-progress-track">
            <div style={{ width: `${averageProgress}%` }}></div>
          </div>

          <div className="dashboard-lesson-summary">
            <span>{completedLessons} Lessons Completed</span>
            <span>{totalLessons} Total Lessons</span>
          </div>
        </section>

        <section className="learning-section">
          <div className="dashboard-section-header">
            <div>
              <span className="section-label">MY LEARNING</span>
              <h2>My Enrolled Courses</h2>
              <p>Continue learning from where you left off.</p>
            </div>

            <Link to="/courses" className="view-all-btn">
              Explore Courses →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="dashboard-empty">
              <div>📚</div>
              <h2>No Enrolled Courses Yet</h2>
              <p>
                You haven't enrolled in any course. Explore courses
                and start your learning journey.
              </p>
              <Link to="/courses" className="browse-empty-btn">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="dashboard-course-grid">
              {courses.map((course) => {
                const courseProgress = progressData[course._id] || {};
                const progress = Math.min(
                  100,
                  Math.max(0, courseProgress.progress || 0)
                );

                const completed = courseProgress.completed || 0;
                const completedList = courseProgress.completedLessons || [];
                const lessonCount = course.lessons?.length || 0;

                const isCompleted =
                  lessonCount > 0 && completed >= lessonCount;

                const nextLessonIndex = Array.from(
                  { length: lessonCount },
                  (_, index) => index
                ).find((index) => !completedList.includes(index));

                const continueLink =
                  nextLessonIndex !== undefined
                    ? `/courses/${course._id}/lesson/${nextLessonIndex}`
                    : `/courses/${course._id}`;

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
                          ? `${course.description.slice(0, 90)}...`
                          : course.description}
                      </p>

                      <div className="progress-header">
                        <span>Your Progress</span>
                        <strong>{progress}%</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="course-progress-info">
                        <span>
                          {completed} / {lessonCount} Lessons
                        </span>

                        <span
                          className={
                            isCompleted ? "completed-label" : ""
                          }
                        >
                          {isCompleted
                            ? "✓ Completed"
                            : progress > 0
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>

                      <div className="dashboard-course-footer">
                        <span className="dashboard-price">
                          {course.price > 0
                            ? `₹${course.price}`
                            : "Free"}
                        </span>

                        <Link
                          to={continueLink}
                          className="continue-btn"
                        >
                          {isCompleted
                            ? "Review Course"
                            : "Continue Learning"} →
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
