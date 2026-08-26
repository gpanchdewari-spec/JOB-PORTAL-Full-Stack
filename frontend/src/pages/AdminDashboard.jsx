import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // All jobs load karne ke liye
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/jobs");

      setJobs(data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Component open hote hi jobs load
  useEffect(() => {
    loadJobs();
  }, []);

  // Job deactivate
  const deactivateJob = async (id) => {
    try {
      setError("");

      await api.patch(`/admin/jobs/${id}/deactivate`);

      setMessage("Job deactivated successfully");

      await loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate job");
    }
  };

  // Job activate
  const activateJob = async (id) => {
    try {
      setError("");

      await api.patch(`/admin/jobs/${id}/activate`);

      setMessage("Job activated successfully");

      await loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to activate job");
    }
  };

  // Job permanently delete
  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this job?",
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await api.delete(`/admin/jobs/${id}`);

      // Deleted job ko frontend se bhi remove kar do
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));

      setMessage("Job deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
    }
  };

  if (loading) {
    return (
      <main className="section container">
        <p>Loading jobs...</p>
      </main>
    );
  }

  return (
    <main className="section container">
      <div className="section-head">
        <span className="pill">Admin Panel</span>

        <h1>Job Moderation</h1>

        <p className="muted">
          Review jobs and remove fake or inappropriate job postings.
        </p>
      </div>

      {message && <div className="alert success">{message}</div>}

      {error && <div className="alert error">{error}</div>}

      {jobs.length === 0 ? (
        <div className="content-card">
          <p>No jobs found.</p>
        </div>
      ) : (
        <div className="admin-jobs">
          {jobs.map((job) => (
            <div className="content-card admin-job-card" key={job._id}>
              <div className="admin-job-top">
                <div>
                  <h2>{job.title}</h2>

                  <p className="muted">
                    {job.company} • {job.location}
                  </p>
                </div>

                <span
                  className={
                    job.isActive
                      ? "admin-status active"
                      : "admin-status inactive"
                  }
                >
                  {job.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="admin-job-info">
                <p>
                  <strong>Job Type:</strong> {job.type}
                </p>

                <p>
                  <strong>Workplace:</strong> {job.workplace}
                </p>

                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
              </div>

              <div className="admin-recruiter">
                <h3>Recruiter</h3>

                <p>{job.recruiter?.name || "Unknown"}</p>

                <p className="muted">
                  {job.recruiter?.email || "Email unavailable"}
                </p>
              </div>

              <p className="admin-description">{job.description}</p>

              <div className="admin-actions">
                {job.isActive ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => deactivateJob(job._id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => activateJob(job._id)}
                  >
                    Activate
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
