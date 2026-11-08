
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier.trim() || !form.password) {
      setError("Please enter your email/mobile number and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        identifier: form.identifier.trim(),
        password: form.password,
      });

      if (!data?.token || !data?.user) {
        setError("Invalid server response. Please try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("learnai-auth-change"));

      const role = data.user?.role;

      if (role === "instructor" || role === "admin") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-showcase">
          <Link to="/" className="auth-logo">🎓 LearnAI</Link>

          <div className="auth-showcase-content">
            <span className="auth-tagline">WELCOME BACK TO LEARNAI</span>
            <h1>
              Continue Your
              <span> Learning Journey.</span>
            </h1>
            <p>
              Sign in to access your courses, track your progress
              and continue building your skills with LearnAI.
            </p>

            <div className="auth-benefits">
              <div><span>✓</span> Access your enrolled courses</div>
              <div><span>✓</span> Track your learning progress</div>
              <div><span>✓</span> Learn anytime, anywhere</div>
            </div>
          </div>

          <div className="auth-showcase-footer">
            Learn. Grow. Achieve.
          </div>
        </div>

        <div className="auth-form-area">
          <div className="auth-form-card">
            <div className="auth-mobile-logo">🎓 LearnAI</div>

            <div className="auth-heading">
              <span>YOUR LEARNING STARTS HERE</span>
              <h2>Welcome Back!</h2>
              <p>Enter your details to sign in to your account.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label htmlFor="identifier">Email Address or Mobile Number</label>
                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  placeholder="Enter email or mobile number"
                  value={form.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>

             
<div className="auth-input-group">
  <label htmlFor="password">Password</label>

  <div className="auth-password-wrapper">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      value={form.password}
      onChange={handleChange}
      autoComplete="current-password"
      required
    />

   
<button
  type="button"
  className="auth-password-toggle"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
  title={showPassword ? "Hide password" : "Show password"}
>
  {showPassword ? "🙈" : "👁️"}
</button>

  </div>
</div>


              <div className="auth-form-options">
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/register">Create account</Link>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In →"}
              </button>
            </form>

            <div className="auth-divider">
              <span>NEW TO LEARNAI?</span>
            </div>

            <p className="auth-switch-text">
              Don't have an account? <Link to="/register">Register Free</Link>
            </p>

            <Link to="/" className="auth-back-home">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
