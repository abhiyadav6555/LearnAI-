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

  // =========================
  // COURSE INPUT
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LESSON INPUT
  // =========================

  const handleLessonChange = (
    index,
    e
  ) => {
    const updatedLessons = [...lessons];

    updatedLessons[index] = {
      ...updatedLessons[index],
      [e.target.name]: e.target.value,
    };

    setLessons(updatedLessons);
  };

  // =========================
  // ADD LESSON
  // =========================

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

  // =========================
  // REMOVE LESSON
  // =========================

  const removeLesson = (index) => {
    if (lessons.length === 1) {
      return;
    }

    setLessons(
      lessons.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // CREATE COURSE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) {
      setError(
        "Please login first."
      );
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

        lessons: lessons.map(
          (lesson) => ({
            title: lesson.title,
            description:
              lesson.description,
            duration: Number(
              lesson.duration
            ),
          })
        ),
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
          navigate(
            "/instructor-dashboard"
          );
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
    <div className="page-container">

      <div className="form-card">

        <h1>
          Create New Course 🚀
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Share your knowledge with
          students.
        </p>

        {/* SUCCESS */}

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* COURSE TITLE */}

          <label>
            Course Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Example: Full Stack MERN Development"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}

          <label>
            Course Description
          </label>

          <textarea
            name="description"
            placeholder="Describe what students will learn..."
            value={form.description}
            onChange={handleChange}
            required
          />

          {/* CATEGORY */}

          <label>
            Category
          </label>

          <input
            type="text"
            name="category"
            placeholder="Example: Web Development"
            value={form.category}
            onChange={handleChange}
            required
          />

          {/* LEVEL */}

          <label>
            Course Level
          </label>

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

          {/* PRICE */}

          <label>
            Course Price (₹)
          </label>

          <input
            type="number"
            name="price"
            min="0"
            placeholder="0 for Free"
            value={form.price}
            onChange={handleChange}
          />

          <hr />

          {/* LESSONS */}

          <h2>
            Course Lessons 📚
          </h2>

          {lessons.map(
            (lesson, index) => (

              <div
                className="card"
                key={index}
              >

                <h3>
                  Lesson {index + 1}
                </h3>

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

                <label>
                  Lesson Description
                </label>

                <textarea
                  name="description"
                  placeholder="What will students learn?"
                  value={
                    lesson.description
                  }
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      e
                    )
                  }
                  required
                />

                <label>
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={
                    lesson.duration
                  }
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      e
                    )
                  }
                  required
                />

                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeLesson(index)
                    }
                  >
                    Remove Lesson
                  </button>
                )}

              </div>
            )
          )}

          {/* ADD LESSON */}

          <button
            type="button"
            onClick={addLesson}
          >
            + Add Another Lesson
          </button>

          <hr />

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Course..."
              : "🚀 Create Course"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateCourse;