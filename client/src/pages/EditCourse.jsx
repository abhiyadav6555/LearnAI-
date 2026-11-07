
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await API.get(`/courses/${id}`);
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
        console.error("FETCH COURSE ERROR:", error);
        alert(error.response?.data?.message || "Unable to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
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
        videoUrl: "",
        duration: 0,
        order: lessons.length + 1,
      },
    ]);
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const updatedCourse = {
        ...formData,
        price: Number(formData.price),
        lessons: lessons.map((lesson, index) => ({
          ...lesson,
          duration: Number(lesson.duration),
          order: index + 1,
        })),
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
        alert("Course updated successfully!");
        navigate("/instructor-dashboard");
      }
    } catch (error) {
      console.error("UPDATE COURSE ERROR:", error);
      alert(error.response?.data?.message || "Course update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="create-course-page">
        <div className="create-course-container">
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-course-page">
      <div className="create-course-container">

        <div className="create-course-header">
          <div>
            <span className="create-course-badge">
              🎓 Instructor Panel
            </span>

            <h1>Edit Course</h1>

            <p>
              Update your course information and manage your lessons.
            </p>
          </div>

          <div className="create-course-header-icon">
            📚
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <section className="create-section">
            <div className="create-section-heading">
              <div className="section-number">01</div>

              <div>
                <h2>Course Information</h2>
                <p>Update the basic information about your course.</p>
              </div>
            </div>

            <div className="create-form-grid">

              <div className="create-form-group full-width">
                <label>Course Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-form-group full-width">
                <label>Course Description</label>
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={formData.description}
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
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-form-group">
                <label>Course Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
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
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-form-group full-width">
                <label>Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail"
                  placeholder="Enter thumbnail image URL"
                  value={formData.thumbnail}
                  onChange={handleChange}
                />
              </div>

            </div>
          </section>

          <section className="create-section">
            <div className="create-section-heading">
              <div className="section-number">02</div>

              <div>
                <h2>Course Lessons</h2>
                <p>Update, add or remove course lessons.</p>
              </div>
            </div>

            <div className="lessons-list">

              {lessons.map((lesson, index) => (
                <div className="lesson-create-card" key={index}>

                  <div className="lesson-create-header">
                    <div className="lesson-number">
                      {index + 1}
                    </div>

                    <div>
                      <h3>Lesson {index + 1}</h3>
                      <span>Edit lesson details</span>
                    </div>

                    <button
                      type="button"
                      className="remove-lesson-btn"
                      onClick={() => removeLesson(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="lesson-form">

                    <div className="create-form-group">
                      <label>Lesson Title</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Lesson Title"
                        value={lesson.title || ""}
                        onChange={(e) => handleLessonChange(index, e)}
                        required
                      />
                    </div>

                    <div className="create-form-group">
                      <label>Duration</label>
                      <div className="duration-input">
                        <input
                          type="number"
                          name="duration"
                          min="0"
                          placeholder="Duration"
                          value={lesson.duration || 0}
                          onChange={(e) => handleLessonChange(index, e)}
                        />
                        <span>minutes</span>
                      </div>
                    </div>

                    <div className="create-form-group full-width">
                      <label>Lesson Description</label>
                      <textarea
                        name="description"
                        placeholder="Lesson Description"
                        value={lesson.description || ""}
                        onChange={(e) => handleLessonChange(index, e)}
                        rows="4"
                      />
                    </div>

                    <div className="create-form-group full-width">
                      <label>Video URL</label>
                      <input
                        type="text"
                        name="videoUrl"
                        placeholder="Enter lesson video URL"
                        value={lesson.videoUrl || ""}
                        onChange={(e) => handleLessonChange(index, e)}
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
              onClick={() => navigate("/instructor-dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-course-btn"
              disabled={updating}
            >
              {updating ? "Updating Course..." : "✓ Update Course"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditCourse;
