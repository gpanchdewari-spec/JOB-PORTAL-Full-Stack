import { useEffect, useState } from "react";
import React from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CandidateDashboard() {
  const { user, refreshUser } = useAuth();
  const [apps, setApps] = useState([]);
  const [profile, setProfile] = useState({
    name: user.name,
    headline: user.headline || "",
    location: user.location || "",
    skills: (user.skills || []).join(", "),
  });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = () =>
    api
      .get("/applications/mine")
      .then((r) => setApps(r.data.applications))
      .catch(() => {});
      
  useEffect(() => {
    load();
  }, []);
  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put("/users/profile", profile);
      await refreshUser();
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };
  const upload = async () => {
    if (!resume) return;
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("resume", resume);
      const { data } = await api.post("/users/resume", fd);
      await refreshUser();
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };
  return (
    <main className="section container dashboard-grid">
      <section>
        <div className="section-head compact">
          <span className="pill">Candidate dashboard</span>
          <h1>Welcome, {user.name.split(" ")[0]}</h1>
        </div>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <div className="content-card">
          <h2>Your profile</h2>
          <form className="stack" onSubmit={saveProfile}>
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </label>
            <label>
              Headline
              <input
                value={profile.headline}
                onChange={(e) =>
                  setProfile({ ...profile, headline: e.target.value })
                }
                placeholder="MERN Developer"
              />
            </label>
            <label>
              Location
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </label>
            <label>
              Skills
              <input
                value={profile.skills}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
                placeholder="React, Node.js, MongoDB"
              />
            </label>
            <button className="btn btn-secondary">Save profile</button>
          </form>
        </div>
        <div className="content-card">
          <h2>Resume</h2>
          <p className="muted">PDF only, maximum 5MB.</p>
          <div className="upload-row">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <button className="btn btn-primary" onClick={upload}>
              Upload resume
            </button>
          </div>
          {user.resumeUrl && (
            <a
              className="text-link"
              href={user.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              View current resume →
            </a>
          )}
        </div>
      </section>
      <aside className="content-card">
        <h2>My applications</h2>
        {apps.length ? (
          apps.map((a) => (
            <div className="application-row" key={a._id}>
              <div>
                <strong>{a.job?.title}</strong>
                <p className="muted small">{a.job?.company}</p>
              </div>
              <span className={`status ${a.status}`}>{a.status}</span>
            </div>
          ))
        ) : (
          <div className="empty small">
            <p>No applications yet.</p>
          </div>
        )}
      </aside>
    </main>
  );
}
