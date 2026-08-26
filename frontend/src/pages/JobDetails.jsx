import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((r) => setJob(r.data.job))
      .catch((e) => setError(e.response?.data?.message || "Job not found"));
  }, [id]);
  const apply = async () => {
    if (!user) return navigate("/login");
    setError("");
    setMessage("");
    try {
      const { data } = await api.post(`/applications/apply/${id}`, {
        coverLetter,
      });
      setMessage(data.message);
    } catch (e) {
      setError(e.response?.data?.message || "Application failed");
    }
  };
  if (error && !job)
    return (
      <main className="section container">
        <div className="alert error">{error}</div>
      </main>
    );
  if (!job)
    return (
      <main className="section container">
        <p>Loading...</p>
      </main>
    );
  return (
    <main className="section container details-layout">
      <section className="content-card">
        <p className="eyebrow">{job.company}</p>
        <h1>{job.title}</h1>
        <p className="muted">
          {job.location} · {job.workplace} · {job.type}
        </p>
        <div className="tag-row">
          {job.skills?.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
        <hr />
        <h3>About the role</h3>
        <p className="preserve">{job.description}</p>
        <h3>Requirements</h3>
        <ul>
          {job.requirements?.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <aside className="side-card">
        <h3>{job.salary || "Not disclosed"}</h3>
        <p className="muted">Compensation</p>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        {user?.role === "candidate" ? (
          <>
            <label>
              Cover letter
              <textarea
                rows="6"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Why are you a good fit?"
              />
            </label>
            <button className="btn btn-primary full" onClick={apply}>
              Apply now
            </button>
          </>
        ) : user?.role === "recruiter" ? (
          <p className="muted">Recruiter accounts cannot apply to jobs.</p>
        ) : (
          <Link className="btn btn-primary full" to="/login">
            Sign in to apply
          </Link>
        )}
      </aside>
    </main>
  );
}
