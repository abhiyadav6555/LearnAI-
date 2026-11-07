
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isStudent = user?.role === "student";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/courses/${id}`);
        const courseData = response.data.course;

        setCourse(courseData);

        const userId = user?._id || user?.id;

        if (userId && user?.role === "student") {
          const enrolled = courseData.students?.some(
            (student) =>
              String(student?._id || student) === String(userId)
          );

          setIsEnrolled(Boolean(enrolled));
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("COURSE DETAILS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      setMessage("Only students can enroll in courses.");
      return;
    }

    try {
      setEnrolling(true);
      setMessage("");

      const response = await API.post(`/courses/${id}/enroll`);

      if (response.data.success) {
        setIsEnrolled(true);

        setCourse((previous) => ({
          ...previous,
          hasLessonAccess: true,
          lessons:
            response.data.course.lessons ||
            previous.lessons ||
            [],
          students: [
            ...(previous.students || []),
            user._id || user.id,
          ],
        }));

        setMessage("Successfully enrolled in this course!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Enrollment failed.";

      if (errorMessage.toLowerCase().includes("already enrolled")) {
        setIsEnrolled(true);

        const response = await API.get(`/courses/${id}`);
        setCourse(response.data.course);
      }

      setMessage(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-details-page">
        <div className="course-details-loading">
          <div className="loading-spinner"></div>
          <h2>Loading course...</h2>
          <p>Please wait while we load the course details.</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-details-page">
        <div className="course-details-error">
          <div className="course-error-icon">⚠️</div>
          <h2>Course Not Found</h2>
          <p>
            {error || "The requested course could not be found."}
          </p>

          <Link to="/courses" className="back-courses-btn">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const lessonCount = course.lessonCount ?? lessons.length;
  const hasLessonAccess = Boolean(course.hasLessonAccess);

  const isInstructor =
    user?.role === "instructor" || user?.role === "admin";

  return (
    <div className="course-details-page">
      <section className="course-details-hero">
        <div className="course-details-container">
          <div className="course-breadcrumb">
            <Link to="/courses">Courses</Link>
            <span>›</span>
            <span>{course.category || "Course"}</span>
          </div>

          <div className="course-details-hero-content">
            <div className="course-details-main">
              <span className="details-category">
                {course.category || "General"}
              </span>

              <h1>{course.title}</h1>

              <p className="details-description">
                {course.description}
              </p>

              <div className="course-meta">
                <div className="meta-item">
                  <span className="meta-icon">📊</span>
                  <div>
                    <small>Level</small>
                    <strong>{course.level || "Beginner"}</strong>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">📚</span>
                  <div>
                    <small>Lessons</small>
                    <strong>{lessonCount}</strong>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">👨‍🏫</span>
                  <div>
                    <small>Instructor</small>
                    <strong>
                      {course.instructor?.name ||
                        "LearnAI Instructor"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-preview-card">
              <div className="course-preview-image">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span>🎓</span>
                    <strong>LearnAI</strong>
                    <small>Start Learning</small>
                  </div>
                )}
              </div>

              <div className="preview-content">
                <div className="preview-price">
                  {course.price > 0
                    ? `₹${course.price}`
                    : "Free"}
                </div>

                {isStudent ? (
                  <button
                    type="button"
                    className="start-course-btn"
                    onClick={
                      isEnrolled
                        ? () =>
                            navigate(
                              lessons.length > 0
                                ? `/courses/${course._id}/lesson/0`
                                : "/student-dashboard"
                            )
                        : handleEnroll
                    }
                    disabled={
                      enrolling ||
                      (isEnrolled && lessons.length === 0)
                    }
                  >
                    {enrolling
                      ? "Enrolling..."
                      : isEnrolled
                        ? "▶ Continue Learning"
                        : "Enroll Now"}
                  </button>
                ) : !user ? (
                  <button
                    type="button"
                    className="start-course-btn"
                    onClick={() => navigate("/login")}
                  >
                    Login to Enroll
                  </button>
                ) : (
                  <div className="start-course-btn disabled-btn">
                    Instructor Account
                  </div>
                )}

                {message && (
                  <p
                    role="status"
                    style={{
                      marginTop: "12px",
                      color: message.toLowerCase().includes("success")
                        ? "#22c55e"
                        : "#f87171",
                      fontSize: "14px",
                    }}
                  >
                    {message}
                  </p>
                )}

                <div className="preview-features">
                  <div>
                    <span>✓</span>
                    Course access
                  </div>

                  <div>
                    <span>✓</span>
                    Learn at your own pace
                  </div>

                  <div>
                    <span>✓</span>
                    Track your progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="course-details-container course-body">
        <div className="course-content-column">
          <section className="details-section">
            <span className="section-label">
              ABOUT THIS COURSE
            </span>

            <h2>What You'll Learn</h2>

            <p className="about-course">
              {course.description}
            </p>

            <div className="learning-points">
              <div>
                <span>✓</span>
                Build practical skills through structured lessons
              </div>

              <div>
                <span>✓</span>
                Learn important concepts step by step
              </div>

              <div>
                <span>✓</span>
                Practice what you learn through the course
              </div>

              <div>
                <span>✓</span>
                Learn at your own pace with LearnAI
              </div>
            </div>
          </section>

          <section className="details-section">
            <div className="lessons-heading">
              <div>
                <span className="section-label">
                  COURSE CONTENT
                </span>
                <h2>Course Lessons</h2>
              </div>

              <span className="lesson-count">
                {lessonCount}{" "}
                {lessonCount === 1 ? "Lesson" : "Lessons"}
              </span>
            </div>

            {!hasLessonAccess && !isEnrolled ? (
              <div className="no-lessons">
                <span>🔒</span>
                <h3>Course Content Locked</h3>

                <p>
                  Enroll in this course to unlock all chapters and
                  lessons.
                </p>

                {isStudent && (
                  <button
                    type="button"
                    className="start-course-btn"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling
                      ? "Enrolling..."
                      : "Enroll Now to Unlock"}
                  </button>
                )}

                {!user && (
                  <button
                    type="button"
                    className="start-course-btn"
                    onClick={() => navigate("/login")}
                  >
                    Login to Enroll
                  </button>
                )}

                {user && !isStudent && (
                  <p>
                    Only enrolled students can access course lessons.
                  </p>
                )}
              </div>
            ) : lessons.length === 0 ? (
              <div className="no-lessons">
                <span>📚</span>
                <h3>No lessons available yet</h3>
                <p>
                  The instructor has not added lessons to this course
                  yet.
                </p>
              </div>
            ) : (
              <div className="lessons-list">
                {lessons.map((lesson, index) => (
                  <div
                    className="lesson-card"
                    key={lesson._id || index}
                  >
                    <div className="lesson-number">
                      {index + 1}
                    </div>

                    <div className="lesson-info">
                      <h3>
                        {lesson.title || `Lesson ${index + 1}`}
                      </h3>

                      <p>
                        {lesson.description ||
                          "Learn important concepts in this lesson."}
                      </p>

                      <div className="lesson-duration">
                        ⏱{" "}
                        {lesson.duration
                          ? `${lesson.duration} minutes`
                          : "Lesson"}
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course._id}/lesson/${index}`}
                      className="lesson-start-btn"
                    >
                      Start <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="course-sidebar">
          <div className="sidebar-card">
            <span className="section-label">
              COURSE INFORMATION
            </span>

            <h3>Course Details</h3>

            <div className="sidebar-detail">
              <span>📚</span>
              <div>
                <small>Category</small>
                <strong>{course.category || "General"}</strong>
              </div>
            </div>

            <div className="sidebar-detail">
              <span>📊</span>
              <div>
                <small>Level</small>
                <strong>{course.level || "Beginner"}</strong>
              </div>
            </div>

            <div className="sidebar-detail">
              <span>🎥</span>
              <div>
                <small>Total Lessons</small>
                <strong>{lessonCount}</strong>
              </div>
            </div>

            <div className="sidebar-detail">
              <span>💰</span>
              <div>
                <small>Course Price</small>
                <strong>
                  {course.price > 0
                    ? `₹${course.price}`
                    : "Free"}
                </strong>
              </div>
            </div>

            <div className="sidebar-instructor">
              <div className="sidebar-avatar">
                {course.instructor?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "I"}
              </div>

              <div>
                <small>Instructor</small>
                <strong>
                  {course.instructor?.name ||
                    "LearnAI Instructor"}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default CourseDetails;
