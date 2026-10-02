import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function Lesson() {
  const { id, lessonIndex } = useParams();
  const navigate = useNavigate();

  const currentIndex = Number(lessonIndex);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        setError("");

        const courseResponse = await API.get(
          `/courses/${id}`
        );

        const courseData = courseResponse.data.course;

        setCourse(courseData);

        const userId = user?._id || user?.id;

        if (userId) {
          try {
            const progressResponse = await API.get(
              `/progress/${userId}/${id}/`
            );

            setProgress(
              progressResponse.data.progressPercentage || 0
            );

            setCompletedLessons(
              progressResponse.data.completedLessons || []
            );
          } catch (progressError) {
            console.error(
              "PROGRESS FETCH ERROR:",
              progressError
            );
          }
        }
      } catch (err) {
        console.error("LESSON ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this lesson."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [id]);

  const lessons = course?.lessons || [];
  const currentLesson = lessons[currentIndex];

  const isFirstLesson = currentIndex === 0;
  const isLastLesson =
    currentIndex === lessons.length - 1;

  const isLessonCompleted = completedLessons.some(
    (lesson) => {
      if (typeof lesson === "object") {
        return (
          lesson.lessonIndex === currentIndex ||
          lesson.index === currentIndex
        );
      }

      return lesson === currentIndex;
    }
  );

  const handleCompleteLesson = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      setCompleting(true);

      const userId = user._id || user.id;

      const response = await API.post(
        `/progress/${userId}/${id}/complete`,
        {
          lessonIndex: currentIndex,
        }
      );

      if (response.data) {
        setProgress(
          response.data.progressPercentage ??
            progress
        );

        if (!isLessonCompleted) {
          setCompletedLessons([
            ...completedLessons,
            currentIndex,
          ]);
        }
      }
    } catch (err) {
      console.error(
        "COMPLETE LESSON ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to complete lesson."
      );
    } finally {
      setCompleting(false);
    }
  };

  const handleNextLesson = () => {
    if (!isLastLesson) {
      navigate(
        `/courses/${id}/lesson/${currentIndex + 1}`
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handlePreviousLesson = () => {
    if (!isFirstLesson) {
      navigate(
        `/courses/${id}/lesson/${currentIndex - 1}`
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="lesson-page">
        <div className="lesson-loading">
          <div className="loading-spinner"></div>
          <h2>Loading lesson...</h2>
          <p>Preparing your learning experience.</p>
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="lesson-page">
        <div className="lesson-error">
          <div className="lesson-error-icon">⚠️</div>

          <h2>Lesson Not Found</h2>

          <p>
            {error ||
              "The requested lesson could not be found."}
          </p>

          <Link
            to={`/courses/${id}`}
            className="lesson-back-btn"
          >
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-container">
        <div className="lesson-topbar">
          <Link
            to={`/courses/${id}`}
            className="back-course-link"
          >
            ← Back to Course
          </Link>

          <span>
            {course.title}
          </span>
        </div>

        <div className="lesson-layout">
          <aside className="lesson-sidebar">
            <div className="sidebar-course-info">
              <span className="section-label">
                COURSE
              </span>

              <h2>{course.title}</h2>

              <div className="sidebar-progress-header">
                <span>Your Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="sidebar-progress-track">
                <div
                  className="sidebar-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="lesson-sidebar-list">
              <h3>Course Lessons</h3>

              {lessons.map((lesson, index) => {
                const completed =
                  completedLessons.some(
                    (item) => {
                      if (
                        typeof item === "object"
                      ) {
                        return (
                          item.lessonIndex ===
                            index ||
                          item.index === index
                        );
                      }

                      return item === index;
                    }
                  );

                return (
                  <Link
                    key={lesson._id || index}
                    to={`/courses/${id}/lesson/${index}`}
                    className={`sidebar-lesson ${
                      index === currentIndex
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="sidebar-lesson-number">
                      {completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <strong>
                        {lesson.title ||
                          `Lesson ${index + 1}`}
                      </strong>

                      <small>
                        {lesson.duration
                          ? `${lesson.duration} min`
                          : "Lesson"}
                      </small>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          <main className="lesson-main">
            <div className="lesson-header">
              <span className="lesson-badge">
                LESSON {currentIndex + 1}
              </span>

              <h1>{currentLesson.title}</h1>

              <div className="lesson-header-meta">
                <span>
                  📚 {course.category || "General"}
                </span>

                <span>
                  ⏱{" "}
                  {currentLesson.duration
                    ? `${currentLesson.duration} minutes`
                    : "Lesson"}
                </span>

                <span>
                  📊 {course.level || "Beginner"}
                </span>
              </div>
            </div>

            <div className="lesson-video-area">
              {currentLesson.videoUrl ? (
                <video
                  controls
                  className="lesson-video"
                  src={currentLesson.videoUrl}
                >
                  Your browser does not support
                  video playback.
                </video>
              ) : (
                <div className="video-placeholder">
                  <div className="video-placeholder-icon">
                    ▶
                  </div>

                  <h2>Lesson Content</h2>

                  <p>
                    Video content will be available
                    here when added by the instructor.
                  </p>
                </div>
              )}
            </div>

            <div className="lesson-content-card">
              <div className="lesson-content-header">
                <div>
                  <span className="section-label">
                    CURRENT LESSON
                  </span>

                  <h2>{currentLesson.title}</h2>
                </div>

                {isLessonCompleted && (
                  <span className="lesson-completed-badge">
                    ✓ Completed
                  </span>
                )}
              </div>

              <p className="lesson-description">
                {currentLesson.description ||
                  "Start learning this lesson and build your knowledge step by step."}
              </p>

              <div className="lesson-actions">
                <button
                  className="previous-lesson-btn"
                  onClick={handlePreviousLesson}
                  disabled={isFirstLesson}
                >
                  ← Previous
                </button>

                <button
                  className={`complete-lesson-btn ${
                    isLessonCompleted
                      ? "already-completed"
                      : ""
                  }`}
                  onClick={handleCompleteLesson}
                  disabled={
                    completing ||
                    isLessonCompleted
                  }
                >
                  {completing
                    ? "Saving..."
                    : isLessonCompleted
                    ? "✓ Lesson Completed"
                    : "✓ Mark as Complete"}
                </button>

                <button
                  className="next-lesson-btn"
                  onClick={handleNextLesson}
                  disabled={isLastLesson}
                >
                  {isLastLesson
                    ? "Course Complete"
                    : "Next Lesson →"}
                </button>
              </div>
            </div>

            <div className="lesson-navigation">
              <button
                onClick={handlePreviousLesson}
                disabled={isFirstLesson}
              >
                ← Previous Lesson
              </button>

              <span>
                Lesson {currentIndex + 1} of{" "}
                {lessons.length}
              </span>

              <button
                onClick={handleNextLesson}
                disabled={isLastLesson}
              >
                Next Lesson →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Lesson;