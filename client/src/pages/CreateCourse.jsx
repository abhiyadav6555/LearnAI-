import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: 0,
  });

  const [lessons, setLessons] = useState([
    {
      title: "",
      description: "",
      duration: 10,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLessonChange = (index, e) => {
    const updatedLessons = [...lessons];

    updatedLessons[index] = {
      ...updatedLessons[index],
      [e.target.name]: e.target.value,
    };

    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        duration: 10,
      },
    ]);
  };

  const removeLesson = (index) => {
    if (lessons.length === 1) {
      return;
    }

    setLessons(
      lessons.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) {
      setError("Please login first.");
      return;
    }

    if (user.role !== "instructor") {
      setError(
        "Only instructors can create courses."
      );
      return;
    }

    if (lessons.length === 0) {
      setError(
        "Please add at least one lesson."
      );
      return;
    }

    try {
      setLoading(true);

      const courseData = {
        title: form.title,
        description: form.description,
        category: form.category,
        level: form.level,
        price: Number(form.price),
        lessons: lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          duration: Number(lesson.duration),
        })),
      };

      const response = await API.post(
        "/courses",
        courseData
      );

      if (response.data.success) {
        setMessage(
          "🎉 Course created successfully!"
        );

        setTimeout(() => {
          navigate("/instructor-dashboard");
        }, 1200);
      }
    } catch (error) {
      console.error(
        "CREATE COURSE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Course creation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-container">

        <div className="create-course-header">
          <div>
            <span className="create-course-badge">
              🎓 Instructor Panel
            </span>

            <h1>Create New Course</h1>

            <p>
              Share your knowledge and create an
              engaging learning experience for
              students.
            </p>
          </div>

          <div className="create-course-header-icon">
            📚
          </div>
        </div>

        {message && (
          <div className="create-success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="create-error">
            <span>!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <section className="create-section">

            <div className="create-section-heading">
              <div className="section-number">
                01
              </div>

              <div>
                <h2>Course Information</h2>

                <p>
                  Add the basic information about
                  your course.
                </p>
              </div>
            </div>

            <div className="create-form-grid">

              <div className="create-form-group full-width">
                <label>Course Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Example: Full Stack MERN Development"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-form-group full-width">
                <label>Course Description</label>

                <textarea
                  name="description"
                  placeholder="Describe what students will learn in this course..."
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className="create-form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="Example: Web Development"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-form-group">
                <label>Course Level</label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>
              </div>

              <div className="create-form-group">
                <label>Course Price</label>

                <div className="price-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>

                <small>
                  Enter 0 to make this course free.
                </small>
              </div>

            </div>
          </section>

          <section className="create-section">

            <div className="create-section-heading">
              <div className="section-number">
                02
              </div>

              <div>
                <h2>Course Lessons</h2>

                <p>
                  Add lessons that students will
                  complete in your course.
                </p>
              </div>
            </div>

            <div className="lessons-list">

              {lessons.map((lesson, index) => (
                <div
                  className="lesson-create-card"
                  key={index}
                >

                  <div className="lesson-create-header">

                    <div className="lesson-number">
                      {index + 1}
                    </div>

                    <div>
                      <h3>
                        Lesson {index + 1}
                      </h3>

                      <span>
                        Add lesson details
                      </span>
                    </div>

                    {lessons.length > 1 && (
                      <button
                        type="button"
                        className="remove-lesson-btn"
                        onClick={() =>
                          removeLesson(index)
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <div className="lesson-form">

                    <div className="create-form-group">
                      <label>
                        Lesson Title
                      </label>

                      <input
                        type="text"
                        name="title"
                        placeholder="Example: Introduction to MERN"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(
                            index,
                            e
                          )
                        }
                        required
                      />
                    </div>

                    <div className="create-form-group">
                      <label>
                        Duration
                      </label>

                      <div className="duration-input">
                        <input
                          type="number"
                          name="duration"
                          min="1"
                          value={lesson.duration}
                          onChange={(e) =>
                            handleLessonChange(
                              index,
                              e
                            )
                          }
                          required
                        />

                        <span>minutes</span>
                      </div>
                    </div>

                    <div className="create-form-group full-width">
                      <label>
                        Lesson Description
                      </label>

                      <textarea
                        name="description"
                        placeholder="Explain what students will learn in this lesson..."
                        value={
                          lesson.description
                        }
                        onChange={(e) =>
                          handleLessonChange(
                            index,
                            e
                          )
                        }
                        rows="4"
                        required
                      />
                    </div>

                  </div>
                </div>
              ))}

            </div>

            <button
              type="button"
              className="add-lesson-btn"
              onClick={addLesson}
            >
              <span>+</span>
              Add Another Lesson
            </button>

          </section>

          <div className="create-course-actions">

            <button
              type="button"
              className="cancel-course-btn"
              onClick={() =>
                navigate("/instructor-dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-course-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating Course...
                </>
              ) : (
                <>
                  🚀 Create Course
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateCourse;