import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";

function CourseDetails() {

  const { id } = useParams();

  const [course, setCourse] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [enrolling, setEnrolling] =
    useState(false);

  const [enrolled, setEnrolled] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {

    const fetchCourse = async () => {

      try {

        const response =
          await API.get(
            `/courses/${id}`
          );

        setCourse(
          response.data.course
        );

      } catch (error) {

        console.error(
          "COURSE ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchCourse();

  }, [id]);

  const handleEnroll = async () => {

    setMessage("");

    if (!user) {
      setMessage(
        "Please login first."
      );
      return;
    }

    if (user.role !== "student") {
      setMessage(
        "Only students can enroll."
      );
      return;
    }

    if (!user.id) {
      setMessage(
        "Student ID not found. Please login again."
      );
      return;
    }

    try {

      setEnrolling(true);

      const response =
        await API.post(
          "/enrollments",
          {
            student: user.id,
            course: course._id,
          }
        );

      if (response.data.success) {

        setEnrolled(true);

        setMessage(
          "🎉 Enrolled successfully!"
        );
      }

    } catch (error) {

      console.error(
        "ENROLL ERROR:",
        error
      );

      const msg =
        error.response?.data?.message ||
        "Enrollment failed.";

      if (
        msg
          .toLowerCase()
          .includes("already enrolled")
      ) {
        setEnrolled(true);
      }

      setMessage(msg);

    } finally {

      setEnrolling(false);

    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>
          Loading course...
        </h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container">
        <h2>
          Course not found
        </h2>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="hero">

        <span className="badge">
          {course.category}
        </span>

        <h1>
          {course.title}
        </h1>

        <p>
          {course.description}
        </p>

        <p>
          <strong>
            Level:
          </strong>{" "}
          {course.level}
        </p>

        <p>
          <strong>
            Price:
          </strong>{" "}
          {course.price === 0
            ? "Free"
            : `₹${course.price}`}
        </p>

        <button
          type="button"
          onClick={handleEnroll}
          disabled={
            enrolling || enrolled
          }
        >
          {enrolling
            ? "Enrolling..."
            : enrolled
            ? "✓ Enrolled"
            : "Enroll Now"}
        </button>

        {message && (
          <div
            className={
              message.includes(
                "successfully"
              )
                ? "success"
                : "error"
            }
          >
            {message}
          </div>
        )}

      </div>

      <h2>
        Course Lessons 📚
      </h2>

      {course.lessons?.length > 0 ? (

        course.lessons.map(
          (lesson, index) => (

            <div
              className="lesson-card"
              key={index}
            >

              <h3>
                {index + 1}.{" "}
                {lesson.title}
              </h3>

              <p>
                {lesson.description}
              </p>

              <p>
                <strong>
                  Duration:
                </strong>{" "}
                {lesson.duration}
                {" "}minutes
              </p>

              <Link
                to={`/courses/${course._id}/lesson/${index}`}
              >
                <button>
                  Start Lesson →
                </button>
              </Link>

            </div>

          )
        )

      ) : (

        <div className="card">
          <p>
            No lessons available.
          </p>
        </div>

      )}

    </div>
  );
}

export default CourseDetails;