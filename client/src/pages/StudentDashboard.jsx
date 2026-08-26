import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get all courses
        const response = await API.get("/courses");

        const allCourses =
          response.data.courses || [];

        setCourses(allCourses);

        // Get progress for each course
        const progressResults = {};

        for (const course of allCourses) {
          try {
            const progressResponse =
              await API.get(
                `/progress/${user?._id || user?.id}/${course._id}`
              );

            progressResults[course._id] =
              progressResponse.data.progress || {
                completedLessons: [],
                progressPercentage: 0,
              };
          } catch (error) {
            console.error(
              "PROGRESS ERROR:",
              error
            );

            progressResults[course._id] = {
              completedLessons: [],
              progressPercentage: 0,
            };
          }
        }

        setProgressData(progressResults);
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <h2>Please login first.</h2>

        <Link to="/login">
          <button className="btn-primary">
            Login
          </button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Student Dashboard</h1>

        <h3>
          Welcome, {user.name || "Student"} 👋
        </h3>

        <p>
          Continue learning and track your
          progress.
        </p>
      </div>

      <hr />

      {/* COURSES */}

      <h2>My Learning</h2>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses available</h3>

          <p>
            Start exploring courses to begin
            learning.
          </p>

          <Link to="/courses">
            <button className="btn-primary">
              Browse Courses
            </button>
          </Link>
        </div>
      ) : (
        <div className="course-grid">

          {courses.map((course) => {

            const progress =
              progressData[course._id] || {
                completedLessons: [],
                progressPercentage: 0,
              };

            const percentage =
              progress.progressPercentage || 0;

            const totalLessons =
              course.lessons?.length || 0;

            const completedLessons =
              progress.completedLessons?.length || 0;

            return (
              <div
                className="course-card"
                key={course._id}
              >

                <h2>
                  {course.title}
                </h2>

                <p>
                  {course.description}
                </p>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {course.category}
                </p>

                <p>
                  <strong>
                    Level:
                  </strong>{" "}
                  {course.level}
                </p>

                <hr />

                {/* PROGRESS */}

                <div className="progress-info">

                  <div className="progress-title">
                    <span>
                      Your Progress
                    </span>

                    <strong>
                      {percentage}%
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>

                  <p>
                    {completedLessons} of{" "}
                    {totalLessons} lessons
                    completed
                  </p>

                </div>

                {/* BUTTON */}

                {percentage >= 100 ? (
                  <Link
                    to={`/courses/${course._id}`}
                  >
                    <button className="btn-success">
                      🎉 Course Completed
                    </button>
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${course._id}`}
                  >
                    <button className="btn-primary">
                      ▶ Continue Learning
                    </button>
                  </Link>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default StudentDashboard;