import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to="/courses"
          className="logo"
        >
          🎓 LearnAI
        </Link>

        {/* MOBILE BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          ☰
        </button>

        {/* LINKS */}

        <div
          className={`nav-links ${
            menuOpen ? "show" : ""
          }`}
        >

          <Link
            to="/courses"
            className="nav-link"
          >
            Courses
          </Link>

          {user?.role === "student" && (
            <Link
              to="/student-dashboard"
              className="nav-link"
            >
              My Learning
            </Link>
          )}

          {user?.role === "instructor" && (
            <Link
              to="/instructor-dashboard"
              className="nav-link"
            >
              Instructor Dashboard
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-link"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="nav-link">
                👤 {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;