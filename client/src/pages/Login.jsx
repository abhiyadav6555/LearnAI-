import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

      const response = await API.post("/auth/login", form);

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      const role = data.user?.role;

      if (role === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your details."
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
              🚀 Welcome Back
            </span>

            <h1>
              Continue Your
              <br />
              <span>Learning Journey.</span>
            </h1>

            <p>
              Sign in to continue learning, track your
              progress, and build skills that move you
              forward.
            </p>

            <div className="auth-feature-list">

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  📚
                </div>

                <div>
                  <strong>Learn at your pace</strong>
                  <span>
                    Continue your courses whenever you want.
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
                    Keep your learning journey organized.
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  🚀
                </div>

                <div>
                  <strong>Build new skills</strong>
                  <span>
                    Learn practical skills through courses.
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

          <div className="auth-form-card">

            <div className="auth-form-header">

              <span className="auth-form-icon">
                👋
              </span>

              <h2>Welcome Back!</h2>

              <p>
                Enter your details to access your
                LearnAI account.
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

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    ✉️
                  </span>

                  <input
                    id="email"
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

                <div className="auth-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <span className="auth-secure-text">
                    🔒 Secure
                  </span>

                </div>

                <div className="auth-input-wrapper">

                  <span className="auth-input-icon">
                    🔑
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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

              </div>

              <div className="auth-options">

                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <span className="forgot-password">
                  Forgot password?
                </span>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to LearnAI
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
                Don't have an account?
              </p>

              <Link to="/register">
                Create Free Account
                <span>→</span>
              </Link>

            </div>

          </div>

          <p className="auth-bottom-text">
            By continuing, you agree to use LearnAI
            for your learning journey.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;