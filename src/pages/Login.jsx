import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function friendlyError(error) {
  const code = error?.code || "";
  if (code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found")) return "No account was found with this email.";
  if (code.includes("wrong-password")) return "Incorrect email or password.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please try again later.";
  return error?.message || "Unable to sign in.";
}

export default function Login({ onGoogleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setMessage("");
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const forgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <div className="brand-mark">
            <i className="bi bi-mortarboard-fill" />
          </div>
          <span className="eyebrow">STUDENT INFORMATION SYSTEM</span>
          <h1>Welcome back.</h1>
          <p>
            Sign in to access your academic information, enrollment details,
            grades, and student services.
          </p>
          <div className="intro-points">
            <div><i className="bi bi-check-circle-fill" /> Secure student access</div>
            <div><i className="bi bi-check-circle-fill" /> Easy academic tracking</div>
            <div><i className="bi bi-check-circle-fill" /> One account for your records</div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="d-lg-none brand-mark small-mark mb-3">
              <i className="bi bi-mortarboard-fill" />
            </div>
            <h2>Sign in</h2>
            <p className="text-muted mb-4">Enter your account credentials.</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && <div className="alert alert-success py-2">{message}</div>}

            <form onSubmit={handleSubmit}>
              <label className="form-label">Email address</label>
              <div className="input-group mb-3">
                <span className="input-group-text"><i className="bi bi-envelope" /></span>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <label className="form-label">Password</label>
              <div className="input-group mb-2">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <label className="form-check small">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="form-check-label">Remember me</span>
                </label>
                <button type="button" className="btn btn-link p-0 small" onClick={forgotPassword}>
                  Forgot password?
                </button>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="divider"><span>OR</span></div>

            <button
              type="button"
              className="btn btn-outline-dark w-100 py-2"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              <i className="bi bi-google me-2" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="text-center small text-muted mt-4 mb-0">
              Don't have an account? <Link to="/signup">Create a student account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
