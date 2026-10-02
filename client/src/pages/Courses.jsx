import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/courses");

        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("COURSES ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = [
    "All",
    ...new Set(
      courses
        .map((course) => course.category)
        .filter(Boolean)
    ),
  ];

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      course.title
        ?.toLowerCase()
        .includes(searchText) ||
      course.description
        ?.toLowerCase()
        .includes(searchText) ||
      course.category
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      course.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-hero">
          <div className="hero-content">
            <span className="hero-badge">
              🎓 LearnAI Learning Platform
            </span>

            <h1>
              Learn. Grow. <span>Succeed.</span> 🚀
            </h1>

            <p>
              Discover practical courses designed
              to help you build real-world skills
              and achieve your learning goals.
            </p>
          </div>
        </div>

        <div className="courses-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="courses-hero">
          <div className="hero-content">
            <span className="hero-badge">
              🎓 LearnAI Learning Platform
            </span>

            <h1>
              Learn. Grow. <span>Succeed.</span> 🚀
            </h1>

            <p>
              Discover practical courses designed
              to help you build real-world skills.
            </p>
          </div>
        </div>

        <div className="courses-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>

            <h2>Unable to load courses</h2>

            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <section className="courses-hero">
        <div className="hero-content">
          <span className="hero-badge">
            🎓 LearnAI Learning Platform
          </span>

          <h1>
            Learn. Grow. <span>Succeed.</span> 🚀
          </h1>

          <p>
            Discover practical courses designed
            to help you build real-world skills,
            learn at your own pace, and grow
            your career.
          </p>
        </div>
      </section>

      <section className="courses-container">
        <div className="courses-header">
          <div>
            <span className="section-label">
              EXPLORE COURSES
            </span>

            <h2>Find Your Next Skill</h2>

            <p>
              Choose from our growing collection
              of courses and start learning today.
            </p>
          </div>

          <div className="course-count">
            <strong>{courses.length}</strong>
            <span>Courses</span>
          </div>
        </div>

        <div className="course-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <span>Category</span>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          <span>
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1
              ? "course"
              : "courses"}{" "}
            found
          </span>

          {(search || category !== "All") && (
            <button
              className="clear-filter"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="empty-courses">
            <div className="empty-icon">📚</div>

            <h2>No courses found</h2>

            <p>
              {courses.length === 0
                ? "Courses will appear here once instructors create them."
                : "Try changing your search or category filter."}
            </p>
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <article
                className="course-card"
                key={course._id}
              >
                <div className="course-image">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                    />
                  ) : (
                    <div className="course-placeholder">
                      <span>🎓</span>

                      <small>LearnAI Course</small>
                    </div>
                  )}

                  <span className="course-level">
                    {course.level || "Beginner"}
                  </span>
                </div>

                <div className="course-content">
                  <div className="course-category">
                    {course.category || "General"}
                  </div>

                  <h3>{course.title}</h3>

                  <p className="course-description">
                    {course.description?.length > 110
                      ? `${course.description.slice(
                          0,
                          110
                        )}...`
                      : course.description}
                  </p>

                  <div className="course-instructor">
                    <div className="instructor-avatar">
                      {course.instructor?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "I"}
                    </div>

                    <div>
                      <span>Instructor</span>

                      <strong>
                        {course.instructor?.name ||
                          "LearnAI Instructor"}
                      </strong>
                    </div>
                  </div>

                  <div className="course-footer">
                    <div className="course-price">
                      {course.price > 0
                        ? `₹${course.price}`
                        : "Free"}
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      className="view-course-btn"
                    >
                      View Course
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;