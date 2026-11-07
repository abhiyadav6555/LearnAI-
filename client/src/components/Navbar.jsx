
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
            <span>Learn<span>AI</span></span>
          </Link>

          <div className="learnai-navigation">
            <NavLink to="/courses" className={navClass}>
              Courses
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to={dashboardPath}
                className={navClass}
              >
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
                <NavLink
                  to="/login"
                  className="nav-login"
                >
                  Log In
                </NavLink>

                <Link
                  to="/register"
                  className="nav-register"
                >
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
          background: rgba(16, 20, 38, 0.96);
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
          gap: 25px;
        }

        .nav-item,
        .nav-login {
          position: relative;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 650;
          padding: 10px 2px;
          white-space: nowrap;
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
          box-shadow: 0 7px 22px rgba(117,71,232,0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nav-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 11px 28px rgba(117,71,232,0.4);
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
        }

        .nav-logout:hover {
          background: rgba(239,68,68,0.24);
          transform: translateY(-1px);
          box-shadow: none;
        }

        @media (max-width: 760px) {
          .navbar-inner {
            width: 96%;
            min-height: 68px;
            gap: 12px;
          }

          .learnai-logo {
            font-size: 21px;
            gap: 6px;
          }

          .logo-icon {
            font-size: 22px;
          }

          .learnai-navigation {
            flex: 1;
            justify-content: flex-end;
            gap: 14px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .learnai-navigation::-webkit-scrollbar {
            display: none;
          }

          .nav-item,
          .nav-login {
            font-size: 12px;
          }

          .nav-register {
            padding: 9px 11px;
            font-size: 12px;
          }

          .nav-user-name {
            display: none;
          }

          .nav-logout {
            padding: 8px 10px;
            font-size: 11px;
          }
        }

        @media (max-width: 420px) {
          .navbar-inner {
            width: 98%;
          }

          .learnai-logo {
            font-size: 18px;
          }

          .logo-icon {
            font-size: 19px;
          }

          .learnai-navigation {
            gap: 10px;
          }

          .nav-item,
          .nav-login {
            font-size: 11px;
          }

          .nav-register {
            padding: 8px 9px;
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
