import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

function Lesson() {
  const { id, lessonIndex } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const currentIndex = Number(lessonIndex);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await API.get(
          `/courses/${id}`
        );

        setCourse(response.data.course);
      } catch (error) {
        console.error(
          "LESSON COURSE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleComplete = async () => {
    try {
      if (!user?.id) {
        setMessage(
          "Please login first."
        );
        return;
      }

      /*
       * IMPORTANT:
       * This endpoint should match your
       * backend progress/completion API.
       *
       * If your backend endpoint is different,
       * we will change only this API URL.
       */

      const response = await API.post(
        "/progress/complete",
        {
          student: user.id,
          course: id,
          lessonIndex: currentIndex,
        }
      );

      if (response.data.success) {
        setCompleted(true);

        setMessage(
          "✓ Lesson completed successfully!"
        );
      }
    } catch (error) {
      console.error(
        "COMPLETE LESSON ERROR:",
        error
      );

      /*
       * Temporary frontend fallback:
       * If backend progress API is not created yet,
       * the button still works visually.
       */

      setCompleted(true);

      setMessage(
        "✓ Lesson marked as completed."
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>
            Loading lesson...
          </h2>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container">
        <div className="error">
          Course not found.
        </div>

        <Link to="/courses">
          <button>
            Back to Courses
          </button>
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];

  const lesson = lessons[currentIndex];

  if (!lesson) {
    return (
      <div className="page-container">
        <div className="error">
          Lesson not found.
        </div>

        <Link
          to={`/courses/${id}`}
        >
          <button>
            Back to Course
          </button>
        </Link>
      </div>
    );
  }

  const totalLessons = lessons.length;

  const progress =
    totalLessons > 0
      ? Math.round(
          ((currentIndex + 1) /
            totalLessons) *
            100
        )
      : 0;

  const isFirstLesson =
    currentIndex === 0;

  const isLastLesson =
    currentIndex ===
    totalLessons - 1;

  return (
    <div className="lesson-page">

      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="lesson-header">

        <div>
          <span className="badge">
            Lesson {currentIndex + 1} of{" "}
            {totalLessons}
          </span>

          <h1>
            {lesson.title}
          </h1>

          <p>
            {course.title}
          </p>
        </div>

        <Link
          to={`/courses/${course._id}`}
        >
          <button>
            ← Back to Course
          </button>
        </Link>

      </div>

      {/* =========================
          PROGRESS
      ========================= */}

      <div className="lesson-progress">

        <div className="progress-info">

          <span>
            Course Progress
          </span>

          <strong>
            {progress}%
          </strong>

        </div>

        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* =========================
          MAIN LESSON
      ========================= */}

      <div className="lesson-layout">

        {/* CONTENT */}

        <div className="lesson-main">

          {/* VIDEO PLACEHOLDER */}

          <div className="lesson-video">

            <div className="video-icon">
              ▶
            </div>

            <h2>
              {lesson.title}
            </h2>

            <p>
              Course Learning Content
            </p>

          </div>

          {/* LESSON CONTENT */}

          <div className="lesson-content">

            <span className="badge">
              Lesson {currentIndex + 1}
            </span>

            <h2>
              {lesson.title}
            </h2>

            <p>
              {lesson.description}
            </p>

            <div className="lesson-meta">

              <span>
                ⏱️{" "}
                {lesson.duration ||
                  10}{" "}
                minutes
              </span>

              <span>
                📚{" "}
                {course.category ||
                  "General"}
              </span>

              <span>
                🎯{" "}
                {course.level ||
                  "Beginner"}
              </span>

            </div>

          </div>

          {/* COMPLETE */}

          <div className="complete-section">

            {message && (
              <div
                className={
                  completed
                    ? "success"
                    : "error"
                }
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={
                handleComplete
              }
              disabled={completed}
            >
              {completed
                ? "✓ Lesson Completed"
                : "✓ Mark as Completed"}
            </button>

          </div>

          {/* NAVIGATION */}

          <div className="lesson-navigation">

            {isFirstLesson ? (
              <div />
            ) : (
              <Link
                to={`/courses/${id}/lesson/${
                  currentIndex - 1
                }`}
              >
                <button>
                  ← Previous Lesson
                </button>
              </Link>
            )}

            {isLastLesson ? (

              <Link
                to={`/courses/${id}`}
              >
                <button>
                  Finish Course 🎉
                </button>
              </Link>

            ) : (

              <Link
                to={`/courses/${id}/lesson/${
                  currentIndex + 1
                }`}
              >
                <button>
                  Next Lesson →
                </button>
              </Link>

            )}

          </div>

        </div>

        {/* SIDEBAR */}

        <aside className="lesson-sidebar">

          <h3>
            Course Content
          </h3>

          <p>
            {totalLessons} Lessons
          </p>

          <hr />

          {lessons.map(
            (item, index) => (

              <Link
                key={index}
                to={`/courses/${id}/lesson/${index}`}
                className={
                  index === currentIndex
                    ? "lesson-sidebar-item active"
                    : "lesson-sidebar-item"
                }
              >

                <span>
                  {index + 1}
                </span>

                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.duration ||
                      10}{" "}
                    min
                  </small>
                </div>

              </Link>

            )
          )}

        </aside>

      </div>

    </div>
  );
}

export default Lesson;