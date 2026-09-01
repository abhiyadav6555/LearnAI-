import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="learnai-navbar">

        {/* ================= LOGO ================= */}

        <Link to="/courses" className="learnai-logo">
          <span className="logo-icon">🎓</span>
          <span>LearnAI</span>
        </Link>


        {/* ================= NAVIGATION ================= */}

        <div className="learnai-navigation">

          <Link to="/courses">
            Courses
          </Link>


          {/* Dashboard */}

          {token && (
            user?.role === "instructor" ? (
              <Link to="/instructor-dashboard">
                Dashboard
              </Link>
            ) : (
              <Link to="/student-dashboard">
                Dashboard
              </Link>
            )
          )}


          {/* ================= AUTH ================= */}

          {!token ? (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="register-link"
              >
                Register Free
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="logout-link"
            >
              Logout
            </button>
          )}

        </div>

      </nav>


      {/* =====================================================
          CSS
      ====================================================== */}

      <style>{`

        /* ==============================================
           MAIN NAVBAR
        ============================================== */

        .learnai-navbar {
          width: 100%;
          height: 76px;

          display: flex;
          align-items: center;

          box-sizing: border-box;

          padding: 0 6%;

          background: rgba(255, 255, 255, 0.97);

          border-bottom: 1px solid #eeeeee;

          position: sticky;
          top: 0;

          z-index: 9999;

          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }


        /* ==============================================
           LOGO
        ============================================== */

        .learnai-logo {
          display: flex;
          align-items: center;

          gap: 9px;

          text-decoration: none;

          color: #4f46e5;

          font-size: 27px;
          font-weight: 800;

          white-space: nowrap;

          transition: 0.25s ease;
        }


        .logo-icon {
          font-size: 25px;
        }


        .learnai-logo:hover {
          transform: translateY(-1px);
        }


        /* ==============================================
           NAVIGATION
        ============================================== */

        .learnai-navigation {
          margin-left: auto;

          display: flex;
          align-items: center;

          gap: 30px;
        }


        .learnai-navigation a {
          text-decoration: none;

          color: #374151;

          font-size: 16px;
          font-weight: 600;

          white-space: nowrap;

          transition: all 0.25s ease;
        }


        .learnai-navigation a {
  position: relative;

  text-decoration: none;

  color: #374151;

  font-size: 16px;
  font-weight: 600;

  white-space: nowrap;

  padding: 8px 2px;

  transition:
    color 0.25s ease,
    transform 0.25s ease;
}


/* Hover */

.learnai-navigation a:hover {
  color: #4f46e5;

  transform: translateY(-2px);
}


/* Underline */

.learnai-navigation a::after {
  content: "";

  position: absolute;

  left: 0;
  bottom: 0;

  width: 0;
  height: 2px;

  background: #4f46e5;

  border-radius: 10px;

  transition: width 0.25s ease;
}


/* Underline Animation */

.learnai-navigation a:hover::after {
  width: 100%;
}
      

        /* ==============================================
           LOGIN
        ============================================== */

        .login-link {
          padding: 10px 5px;
        }
        .login-link:hover {
          transform: translateY(-1px);
        }  


        /* ==============================================
           REGISTER BUTTON
        ============================================== */

        .register-link {
          background: #4f46e5;

          color: white !important;

          padding: 12px 20px;

          border-radius: 10px;

          font-size: 15px !important;

          font-weight: 700 !important;

          box-shadow:
            0 6px 18px rgba(79, 70, 229, 0.22);

          transition: all 0.25s ease !important;
        }


        .register-link:hover {
          background: #4338ca;

          transform: translateY(-1px);

          box-shadow:
            0 9px 22px rgba(79, 70, 229, 0.30);
        }


        /* ==============================================
           LOGOUT
        ============================================== */

        .logout-link {
          border: none;

          background: #ef4444;

          color: white;

          padding: 11px 19px;

          border-radius: 10px;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;

          white-space: nowrap;

          transition: all 0.25s ease;
        }


        .logout-link:hover {
          background: #dc2626;

          transform: translateY(-1px);
        }


        /* ==============================================
           TABLET
        ============================================== */

        @media (max-width: 900px) {

          .learnai-navbar {
            padding: 0 25px;
          }


          .learnai-logo {
            font-size: 23px;
          }


          .logo-icon {
            font-size: 22px;
          }


          .learnai-navigation {
            gap: 18px;
          }


          .learnai-navigation a {
            font-size: 14px;
          }


          .register-link {
            padding: 10px 14px;
          }

        }


        /* ==============================================
           MOBILE
        ============================================== */

        @media (max-width: 600px) {

          .learnai-navbar {
            height: 64px;

            padding: 0 10px;

            overflow: hidden;
          }


          /* Logo */

          .learnai-logo {
            font-size: 18px;

            gap: 4px;

            flex-shrink: 0;
          }


          .logo-icon {
            font-size: 18px;
          }


          /* Navigation */

          .learnai-navigation {
            margin-left: auto;

            gap: 8px;

            flex-shrink: 0;
          }


          .learnai-navigation a {
            font-size: 12px;

            font-weight: 600;
          }


          /* Login */

          .login-link {
            padding: 5px 2px;
          }


          /* Register */

          .register-link {
            padding: 8px 9px;

            border-radius: 8px;

            font-size: 11px !important;
          }


          /* Logout */

          .logout-link {
            padding: 8px 9px;

            border-radius: 8px;

            font-size: 11px;
          }

        }


        /* ==============================================
           VERY SMALL MOBILE
        ============================================== */

        @media (max-width: 380px) {

          .learnai-navbar {
            padding: 0 7px;
          }


          .learnai-logo {
            font-size: 16px;
          }


          .logo-icon {
            font-size: 16px;
          }


          .learnai-navigation {
            gap: 5px;
          }


          .learnai-navigation a {
            font-size: 10px;
          }


          .register-link {
            padding: 7px 7px;

            font-size: 10px !important;
          }


          .login-link {
            font-size: 10px !important;
          }

        }

      `}</style>
    </>
  );
}

export default Navbar;