import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initial = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  workplace: "On-site",
  salary: "",
  description: "",
  skills: "",
  requirements: "",
};
export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = () =>
    api
      .get("/jobs/mine")
      .then((r) => setJobs(r.data.jobs))
      .catch(() => {});

      
  useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/jobs", form);
      setForm(initial);
      setMessage("Job published");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create job");
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this job and its applications?")) return;
    await api.delete(`/jobs/${id}`);
    load();
  };
  return (
    <main className="section container">
      <div className="section-head">
        <span className="pill">Recruiter workspace</span>
        <h1>Post roles and manage applicants</h1>
      </div>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="dashboard-grid">
        <section className="content-card">
          <h2>Create a job</h2>
          <form className="form-grid" onSubmit={create}>
            <label>
              Job title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Company
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </label>
            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </label>
            <label>
              Salary
              <input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="₹4–6 LPA"
              />
            </label>
            <label>
              Job type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </label>
            <label>
              Workplace
              <select
                value={form.workplace}
                onChange={(e) =>
                  setForm({ ...form, workplace: e.target.value })
                }
              >
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </label>
            <label className="span-2">
              Skills
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </label>
            <label className="span-2">
              Requirements
              <input
                value={form.requirements}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
                placeholder="JavaScript fundamentals, Git basics"
              />
            </label>
            <label className="span-2">
              Description
              <textarea
                rows="7"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </label>
            <button className="btn btn-primary span-2">Publish job</button>
          </form>
        </section>
        <aside className="content-card">
          <h2>Your jobs</h2>
          {jobs.length ? (
            jobs.map((job) => (
              <div className="recruiter-job" key={job._id}>
                <div>
                  <strong>{job.title}</strong>
                  <p className="muted small">{job.applicants} applicant(s)</p>
                </div>
                <div className="row-actions">
                  <Link
                    className="text-link"
                    to={`/recruiter/jobs/${job._id}/applicants`}
                  >
                    Applicants
                  </Link>
                  <button
                    className="link-danger"
                    onClick={() => remove(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No jobs posted yet.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
