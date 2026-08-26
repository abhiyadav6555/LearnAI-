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

      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="form-card">

      <h1>Create Account 🚀</h1>

      <p>
        Join LearnAI and start learning.
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <label>
          Full Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          minLength="6"
          required
        />

        <label>
          Account Type
        </label>

        <select
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

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  );
}

export default Register;