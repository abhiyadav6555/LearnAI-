import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../api/api";

function InstructorDashboard() {

  const navigate = useNavigate();

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const fetchMyCourses = async () => {

    try {

      const response =
        await API.get(
          "/courses/my-courses"
        );

      setCourses(
        response.data.courses || []
      );

    } catch (error) {

      console.error(
        "MY COURSES ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleDelete = async (
    courseId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response =
        await API.delete(
          `/courses/${courseId}`
        );

      if (response.data.success) {

        alert(
          "Course deleted successfully!"
        );

        fetchMyCourses();

      }

    } catch (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Delete failed."
      );

    }
  };

  return (
    <div className="dashboard">

      <div className="hero">

        <h1>
          Instructor Dashboard 🎓
        </h1>

        <p>
          Welcome,{" "}
          {user?.name || "Instructor"}
        </p>

        <Link to="/create-course">

          <button>
            + Create New Course
          </button>

        </Link>

      </div>

      <h2>
        My Courses
      </h2>

      {loading ? (

        <p>
          Loading courses...
        </p>

      ) : courses.length === 0 ? (

        <div className="card">

          <h3>
            No courses available
          </h3>

          <p>
            Start by creating your
            first course.
          </p>

          <Link to="/create-course">

            <button>
              Create Your First Course
            </button>

          </Link>

        </div>

      ) : (

        <div className="course-grid">

          {courses.map((course) => (

            <div
              className="course-card"
              key={course._id}
            >

              <span className="badge">
                {course.category}
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

              <Link
                to={`/courses/${course._id}`}
              >
                <button>
                  View Course
                </button>
              </Link>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/edit-course/${course._id}`
                  )
                }
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    course._id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default InstructorDashboard;