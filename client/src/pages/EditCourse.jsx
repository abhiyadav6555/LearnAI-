import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: 0,
    thumbnail: "",
  });

  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ===============================
  // FETCH COURSE
  // ===============================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await API.get(
          `/courses/${id}`
        );

        const course = response.data.course;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "Beginner",
          price: course.price || 0,
          thumbnail: course.thumbnail || "",
        });

        setLessons(course.lessons || []);

      } catch (error) {
        console.error(
          "FETCH COURSE ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ===============================
  // COURSE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // LESSON CHANGE
  // ===============================

  const handleLessonChange = (index, e) => {
    const updatedLessons = [...lessons];

    updatedLessons[index] = {
      ...updatedLessons[index],
      [e.target.name]: e.target.value,
    };

    setLessons(updatedLessons);
  };

  // ===============================
  // ADD LESSON
  // ===============================

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: "",
        description: "",
        videoUrl: "",
        duration: 0,
        order: lessons.length + 1,
      },
    ]);
  };

  // ===============================
  // REMOVE LESSON
  // ===============================

  const removeLesson = (index) => {
    const updatedLessons = lessons.filter(
      (_, i) => i !== index
    );

    setLessons(updatedLessons);
  };

  // ===============================
  // UPDATE COURSE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);

    try {
      const token = localStorage.getItem(
        "token"
      );

      const updatedCourse = {
        ...formData,

        price: Number(formData.price),

        lessons: lessons.map(
          (lesson, index) => ({
            ...lesson,
            duration: Number(
              lesson.duration
            ),
            order: index + 1,
          })
        ),
      };

      const response = await API.put(
        `/courses/${id}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert(
          "Course updated successfully!"
        );

        navigate("/instructor-dashboard");
      }

    } catch (error) {
      console.error(
        "UPDATE COURSE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Course update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <h2>
        Loading course...
      </h2>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div>

      <h1>
        Edit Course
      </h1>

      <form onSubmit={handleSubmit}>

        {/* COURSE TITLE */}

        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        {/* CATEGORY */}

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        {/* LEVEL */}

        <select
          name="level"
          value={formData.level}
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

        <br />
        <br />

        {/* PRICE */}

        <input
          type="number"
          name="price"
          min="0"
          value={formData.price}
          onChange={handleChange}
        />

        <br />
        <br />

        {/* THUMBNAIL */}

        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={formData.thumbnail}
          onChange={handleChange}
        />

        <hr />

        <h2>
          Lessons
        </h2>

        {/* LESSONS */}

        {lessons.map(
          (lesson, index) => (
            <div key={index}>

              <h3>
                Lesson {index + 1}
              </h3>

              <input
                type="text"
                name="title"
                placeholder="Lesson Title"
                value={lesson.title || ""}
                onChange={(e) =>
                  handleLessonChange(
                    index,
                    e
                  )
                }
                required
              />

              <br />
              <br />

              <textarea
                name="description"
                placeholder="Lesson Description"
                value={
                  lesson.description || ""
                }
                onChange={(e) =>
                  handleLessonChange(
                    index,
                    e
                  )
                }
              />

              <br />
              <br />

              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL"
                value={
                  lesson.videoUrl || ""
                }
                onChange={(e) =>
                  handleLessonChange(
                    index,
                    e
                  )
                }
              />

              <br />
              <br />

              <input
                type="number"
                name="duration"
                min="0"
                placeholder="Duration"
                value={
                  lesson.duration || 0
                }
                onChange={(e) =>
                  handleLessonChange(
                    index,
                    e
                  )
                }
              />

              <br />
              <br />

              <button
                type="button"
                onClick={() =>
                  removeLesson(index)
                }
              >
                Remove Lesson
              </button>

              <hr />

            </div>
          )
        )}

        {/* ADD LESSON */}

        <button
          type="button"
          onClick={addLesson}
        >
          + Add Lesson
        </button>

        <br />
        <br />

        {/* UPDATE */}

        <button
          type="submit"
          disabled={updating}
        >
          {updating
            ? "Updating..."
            : "Update Course"}
        </button>

      </form>

    </div>
  );
}

export default EditCourse;