
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Normalize Indian mobile number
  const normalizePhone = (value) => {
    let phone = value.trim().replace(/[\s()-]/g, "");

    if (/^\d{10}$/.test(phone)) {
      phone = "+91" + phone;
    } else if (/^91\d{10}$/.test(phone)) {
      phone = "+" + phone;
    }

    return /^\+\d{10,15}$/.test(phone) ? phone : null;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const mobileNumber = normalizePhone(form.mobileNumber);

    if (!mobileNumber) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", {
        ...form,
        mobileNumber,
      });

      if (!data?.success) {
        setError(data?.message || "Registration failed.");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
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
            🎓 LearnAI
          </Link>

          <div className="auth-showcase-content">
            <span className="auth-tagline">
              START YOUR LEARNING JOURNEY
            </span>

            <h1>
              Learn Today.
              <span> Grow Tomorrow.</span>
            </h1>

            <p>
              Create your LearnAI account and start building
              practical skills through structured courses and lessons.
            </p>

            <div className="auth-benefits">
              <div>
                <span>✓</span> Explore professional courses
              </div>

              <div>
                <span>✓</span> Track your learning progress
              </div>

              <div>
                <span>✓</span> Learn anytime, anywhere
              </div>
            </div>
          </div>

          <div className="auth-showcase-footer">
            Learn. Grow. Achieve.
          </div>
        </div>

        <div className="auth-form-area">
          <div className="auth-form-card">

            <div className="auth-mobile-logo">
              🎓 LearnAI
            </div>

            <div className="auth-heading">
              <span>JOIN THE LEARNAI COMMUNITY</span>
              <h2>Create Account</h2>
              <p>Fill in your details to get started.</p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="auth-input-group">
                <label htmlFor="name">Full Name</label>

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

              {/* Email */}
              <div className="auth-input-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="auth-input-group">
                <label htmlFor="mobileNumber">
                  Mobile Number
                </label>

                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter your 10-digit mobile number"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />

                <small>
                  OTP verification is currently disabled.
                </small>
              </div>

              {/* Password with Show/Hide */}
              <div className="auth-input-group">
                <label htmlFor="password">Password</label>

                <div className="auth-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div className="auth-input-group">
                <label htmlFor="role">Account Type</label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Free Account →"}
              </button>

            </form>

            <div className="auth-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to="/login">Sign In</Link>
            </p>

            <Link to="/" className="auth-back-home">
              ← Back to Home
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
