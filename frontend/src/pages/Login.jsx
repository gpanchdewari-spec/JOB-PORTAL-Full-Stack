import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === "recruiter" ? "/recruiter" : "/candidate");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };

  return <main className="auth-page"><form className="form-card" onSubmit={submit}>
    <span className="pill">Welcome back</span><h1>Sign in to JobFlow</h1>
    {error && <div className="alert error">{error}</div>}
    <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
    <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></label>
    <button className="btn btn-primary full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    <p className="center muted">New here? <Link className="text-link" to="/register">Create an account</Link></p>
  </form></main>;
}
