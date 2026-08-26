import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function Courses() {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        const response =
          await API.get("/courses");

        setCourses(
          response.data.courses || []
        );

      } catch (error) {

        console.error(
          "COURSES ERROR:",
          error
        );

        setError(
          "Unable to load courses."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchCourses();

  }, []);

  return (
    <div className="page-container">

      <div className="hero">

        <h1>
          Learn. Build. Grow. 🚀
        </h1>

        <p>
          Explore quality courses and
          build your skills with LearnAI.
        </p>

        <Link to="/register">
          <button>
            Start Learning
          </button>
        </Link>

      </div>

      <h1>
        Explore Courses
      </h1>

      {loading && (
        <p>
          Loading courses...
        </p>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {!loading &&
      !error &&
      courses.length === 0 && (
        <div className="card">
          <h3>
            No courses available
          </h3>

          <p>
            Instructor hasn't created
            any course yet.
          </p>
        </div>
      )}

      <div className="course-grid">

        {courses.map((course) => (

          <div
            className="course-card"
            key={course._id}
          >

            <span className="badge">
              {course.category ||
                "General"}
            </span>

            <h2>
              {course.title}
            </h2>

            <p>
              {course.description}
            </p>

            <p>
              <strong>
                Level:
              </strong>{" "}
              {course.level ||
                "Beginner"}
            </p>

            <p>
              <strong>
                Price:
              </strong>{" "}
              {course.price === 0
                ? "Free"
                : `₹${course.price}`}
            </p>

            <Link
              to={`/courses/${course._id}`}
            >
              <button>
                View Course →
              </button>
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Courses;