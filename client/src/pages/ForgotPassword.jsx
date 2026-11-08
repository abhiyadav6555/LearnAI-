
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";

function ForgotPassword() {
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPhoneNumber = () => {
    let phone = mobileNumber.trim().replace(/[\s()-]/g, "");

    if (/^\d{10}$/.test(phone)) phone = "+91" + phone;
    else if (/^91\d{10}$/.test(phone)) phone = "+" + phone;

    return /^\+\d{10,15}$/.test(phone) ? phone : null;
  };

  const sendOTP = async () => {
    setError("");

    const phone = getPhoneNumber();

    if (!phone) {
      setError("Please enter a valid mobile number.");
      return;
    }

    try {
      setLoading(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "forgot-recaptcha",
          { size: "invisible" }
        );
      }

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      alert("OTP sent successfully!");
    } catch (err) {
      console.error("FORGOT OTP ERROR:", err);
      setError(err.message || "Unable to send OTP.");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError("");

    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const result = await confirmation.confirm(otp.trim());
      const token = await result.user.getIdToken(true);

      setIdToken(token);
      setConfirmation(null);
      alert("Phone verified successfully!");
    } catch (err) {
      console.error("OTP VERIFY ERROR:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!idToken) {
      setError("Please verify your mobile number first.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/reset-password", {
        idToken,
        newPassword,
      });

      alert("Password updated successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error("PASSWORD RESET ERROR:", err);
      setError(
        err.response?.data?.message || "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-showcase">
          <Link to="/" className="auth-logo">🎓 LearnAI</Link>

          <div className="auth-showcase-content">
            <span className="auth-tagline">ACCOUNT RECOVERY</span>
            <h1>
              Reset Your
              <span> Password.</span>
            </h1>
            <p>
              Verify your registered mobile number with a one-time password
              and securely create a new password.
            </p>
          </div>

          <div className="auth-showcase-footer">
            Learn. Grow. Achieve.
          </div>
        </div>

        <div className="auth-form-area">
          <div className="auth-form-card">
            <div className="auth-mobile-logo">🎓 LearnAI</div>

            <div className="auth-heading">
              <span>SECURE ACCOUNT RECOVERY</span>
              <h2>Forgot Password?</h2>
              <p>Enter your registered mobile number to continue.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={resetPassword}>
              <div className="auth-input-group">
                <label htmlFor="forgot-mobile">Registered Mobile Number</label>
                <input
                  id="forgot-mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setIdToken("");
                  }}
                  required
                />

                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={sendOTP}
                  disabled={loading || !!idToken}
                >
                  {idToken ? "Mobile Verified ✓" : loading ? "Sending..." : "Send OTP"}
                </button>
              </div>

              {confirmation && (
                <div className="auth-input-group">
                  <label htmlFor="forgot-otp">Enter OTP</label>
                  <input
                    id="forgot-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={verifyOTP}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              <div id="forgot-recaptcha"></div>

              {idToken && (
                <>
                  <div className="auth-input-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength="6"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="auth-input-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength="6"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Updating Password..." : "Update Password"}
                  </button>
                </>
              )}
            </form>

            <p className="auth-switch-text">
              Remember your password? <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
