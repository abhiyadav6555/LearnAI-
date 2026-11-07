import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const dashboardPath =
    user?.role === "instructor" || user?.role === "admin"
      ? "/instructor-dashboard"
      : "/student-dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`;

  return (
    <>
      <nav className="learnai-navbar">
        <div className="navbar-inner">
          <Link to="/" className="learnai-logo">
            <span className="logo-icon">🎓</span>
            <span>
              Learn<span>AI</span>
            </span>
          </Link>

          <div className="learnai-navigation">
            <NavLink to="/courses" className={navClass}>
              Courses
            </NavLink>

            {isAuthenticated && (
              <NavLink to={dashboardPath} className={navClass}>
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink to="/profile" className={navClass}>
                Profile
              </NavLink>
            )}

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="nav-login">
                  Log In
                </NavLink>

                <Link to="/register" className="nav-register">
                  Get Started <span>→</span>
                </Link>
              </>
            ) : (
              <>
                <div className="nav-user">
                  <span className="nav-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>

                  <span className="nav-user-name">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-logout"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        .learnai-navbar {
          position: sticky;
          top: 0;
          z-index: 9999;
          width: 100%;
          background: rgba(16, 20, 38, 0.97);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 8px 30px rgba(0,0,0,0.18);
        }

        .navbar-inner {
          width: min(1280px, 92%);
          min-height: 76px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .learnai-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 27px;
          font-weight: 850;
          letter-spacing: -1px;
          white-space: nowrap;
          text-decoration: none;
        }

        .learnai-logo > span:last-child > span {
          color: #a78bfa;
        }

        .logo-icon {
          font-size: 27px;
        }

        .learnai-navigation {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 25px;
          min-width: 0;
        }

        .nav-item,
        .nav-login {
          position: relative;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 650;
          padding: 10px 2px;
          white-space: nowrap;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-item::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 0;
          height: 2px;
          border-radius: 10px;
          background: #a78bfa;
          transition: width 0.25s ease;
        }

        .nav-item:hover,
        .nav-item.active,
        .nav-login:hover {
          color: #c4b5fd;
        }

        .nav-item:hover::after,
        .nav-item.active::after {
          width: 100%;
        }

        .nav-register {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 18px;
          border-radius: 11px;
          color: #fff;
          background: linear-gradient(135deg, #7547e8, #9b6cff);
          font-size: 14px;
          font-weight: 750;
          white-space: nowrap;
          text-decoration: none;
          box-shadow: 0 7px 22px rgba(117,71,232,0.28);
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 650;
          white-space: nowrap;
        }

        .nav-avatar {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: linear-gradient(135deg, #7547e8, #a78bfa);
        }

        .nav-logout {
          margin: 0;
          padding: 10px 15px;
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 9px;
          color: #fecaca;
          background: rgba(239,68,68,0.12);
          box-shadow: none;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
        }

        .nav-logout:hover {
          background: rgba(239,68,68,0.24);
        }

        @media (max-width: 760px) {
          .navbar-inner {
            width: 100%;
            min-height: auto;
            padding: 12px 14px 10px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 9px;
          }

          .learnai-logo {
            font-size: 23px;
            gap: 7px;
          }

          .logo-icon {
            font-size: 23px;
          }

          .learnai-navigation {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px 17px;
          }

          .nav-item,
          .nav-login {
            font-size: 13px;
            padding: 7px 1px;
          }

          .nav-register {
            padding: 8px 12px;
            font-size: 12px;
          }

          .nav-user {
            gap: 5px;
          }

          .nav-user-name {
            display: none;
          }

          .nav-avatar {
            width: 29px;
            height: 29px;
          }

          .nav-logout {
            padding: 8px 11px;
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .learnai-navigation {
            gap: 7px 12px;
          }

          .nav-item,
          .nav-login {
            font-size: 12px;
          }

          .nav-logout {
            padding: 7px 9px;
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;