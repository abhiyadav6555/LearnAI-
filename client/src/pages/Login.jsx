import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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
        "/auth/login",
        form
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      const role =
        data.user?.role;

      if (role === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your details."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="form-card">

      <h1>Welcome Back 👋</h1>

      <p>
        Login to continue learning with
        LearnAI.
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <label>
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>
          Password
        </label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}

        <Link to="/register">
          Create Account
        </Link>
      </p>

    </div>
  );
}

export default Login;