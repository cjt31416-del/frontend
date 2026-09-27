import React, { useState } from "react";
import { Link } from "react-router-dom";

function friendlyError(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "This email is already registered.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  return error?.message || "Unable to create your account.";
}

export default function Signup({ onSignup, onGoogleLogin }) {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await onSignup(form);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="signup-card">
        <div className="signup-side">
          <div className="brand-mark">
            <i className="bi bi-person-vcard-fill" />
          </div>
          <span className="eyebrow">NEW STUDENT</span>
          <h1>Start your academic journey.</h1>
          <p>
            Create your student account and keep your school information
            organized in one place.
          </p>
          <div className="signup-feature">
            <i className="bi bi-shield-check" />
            <div>
              <strong>Secure account</strong>
              <small>Powered by Firebase Authentication</small>
            </div>
          </div>
          <div className="signup-feature">
            <i className="bi bi-journal-text" />
            <div>
              <strong>Academic records</strong>
              <small>View your student information and grades</small>
            </div>
          </div>
        </div>

        <div className="signup-form">
          <h2>Create account</h2>
          <p className="text-muted mb-4">Student accounts are created with the student role automatically.</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Full name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person" /></span>
                  <input className="form-control" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Juan Dela Cruz" required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Student ID</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-card-text" /></span>
                  <input className="form-control" value={form.studentId} onChange={(e) => update("studentId", e.target.value)} placeholder="2026-0001" required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope" /></span>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="student@email.com" required />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock" /></span>
                  <input type={showPassword ? "text" : "password"} className="form-control" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Minimum 6 characters" required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}><i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} /></button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Confirm password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
                  <input type={showConfirm ? "text" : "password"} className="form-control" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Repeat password" required />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirm(!showConfirm)}><i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} /></button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-100 py-2 mt-4 fw-semibold" disabled={loading}>
              {loading ? "Creating account..." : "Create student account"}
            </button>
          </form>

          <div className="divider"><span>OR</span></div>

          <button type="button" className="btn btn-outline-dark w-100 py-2" onClick={google} disabled={googleLoading}>
            <i className="bi bi-google me-2" />
            {googleLoading ? "Connecting..." : "Sign up with Google"}
          </button>

          <p className="text-center small text-muted mt-4 mb-0">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
