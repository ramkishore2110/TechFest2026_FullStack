import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = location.state?.from || "/events";

  if (user) {
    return (
      <section>
        <h2>Already logged in</h2>
        <p>You are logged in as {user.name}.</p>
        <Link to="/events" className="link-btn">View events</Link>
      </section>
    );
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>{isLogin ? "Login" : "Create Account"}</h2>
      <p>{isLogin ? "Log in to register for TechFest events." : "Create a participant account to join events."}</p>

      <form className="register-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} minLength="2" maxLength="60" required />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="login-email">Email *</label>
          <input id="login-email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password *</label>
          <input id="login-password" name="password" type="password" value={form.password} onChange={handleChange} minLength="8" required />
          {!isLogin && <small>Use at least 8 characters.</small>}
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}</button>
      </form>

      <p style={{ marginTop: "14px" }}>
        {isLogin ? "New to TechFest? " : "Already have an account? "}
        <button type="button" className="link-btn" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
          {isLogin ? "Create an account" : "Login"}
        </button>
      </p>
    </section>
  );
}
