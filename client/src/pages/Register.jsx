import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        form
      );

      if (response.data) {
        alert(
          "Registration successful! Please login."
        );

        navigate("/login");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-showcase">

          <Link to="/" className="auth-logo">
            <span>🎓</span>
            LearnAI
          </Link>

          <div className="auth-showcase-content">

            <span className="auth-badge">
              ✨ Start Your Journey
            </span>

            <h1>
              Learn Today.
              <br />
              <span>Grow Tomorrow.</span>
            </h1>

            <p>
              Create your LearnAI account and start
              building practical skills through
              structured courses and lessons.
            </p>

            <div className="auth-feature-list">

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  📚
                </div>

                <div>
                  <strong>Explore courses</strong>
                  <span>
                    Discover courses designed for your
                    learning journey.
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  🎯
                </div>

                <div>
                  <strong>Track your progress</strong>
                  <span>
                    Keep track of your completed lessons
                    and learning progress.
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  👨‍🏫
                </div>

                <div>
                  <strong>Share your knowledge</strong>
                  <span>
                    Choose instructor mode and create
                    courses for students.
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="auth-showcase-footer">
            <span>🎓 Learn. Grow. Succeed.</span>
            <span>© 2026 LearnAI</span>
          </div>

        </div>

        <div className="auth-form-area">

          <div className="auth-mobile-logo">
            <Link to="/">
              🎓 <span>LearnAI</span>
            </Link>
          </div>

          <div className="auth-form-card register-card">

            <div className="auth-form-header">

              <span className="auth-form-icon">
                🚀
              </span>

              <h2>Create Your Account</h2>

              <p>
                Join LearnAI and start your learning
                journey today.
              </p>

            </div>

            {error && (
              <div className="auth-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="auth-input-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              <div className="auth-input-group">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    ✉️
                  </span>

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              <div className="auth-input-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    🔑
                  </span>

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>

                <span className="auth-input-hint">
                  Password must contain at least 6
                  characters.
                </span>

              </div>

              <div className="auth-input-group">

                <label htmlFor="role">
                  Account Type
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    🎓
                  </span>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="instructor">
                      Instructor
                    </option>
                  </select>

                </div>

              </div>

              <div className="role-info">

                <div className="role-info-icon">
                  {form.role === "student"
                    ? "🎓"
                    : "👨‍🏫"}
                </div>

                <div>
                  <strong>
                    {form.role === "student"
                      ? "Student Account"
                      : "Instructor Account"}
                  </strong>

                  <span>
                    {form.role === "student"
                      ? "Browse courses, enroll in lessons, and track your progress."
                      : "Create courses, add lessons, and share your knowledge."}
                  </span>
                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Free Account
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-register-box">

              <p>
                Already have an account?
              </p>

              <Link to="/login">
                Login to LearnAI
                <span>→</span>
              </Link>

            </div>

          </div>

          <p className="auth-bottom-text">
            Create your account and take the next
            step in your learning journey.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;