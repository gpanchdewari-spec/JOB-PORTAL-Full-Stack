import { useEffect, useState } from "react";
import React from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    workplace: "",
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async (params = filters) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load jobs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load({});
  }, []);
  const submit = (e) => {
    e.preventDefault();
    load(filters);
  };
  return (
    <main className="section container">
      <div className="section-head">
        <span className="pill">Opportunities</span>
        <h1>Find your next role</h1>
      </div>
      <form className="filter-bar" onSubmit={submit}>
        <input
          placeholder="Job title, company or skill"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <button className="btn btn-primary">Search</button>
      </form>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p className="muted">Loading jobs...</p>
      ) : jobs.length ? (
        <div className="job-grid">
          {jobs.map((j) => (
            <JobCard key={j._id} job={j} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No jobs found</h3>
          <p>Try changing your filters.</p>
        </div>
      )}
    </main>
  );
}
