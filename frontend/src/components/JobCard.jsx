import { Link } from "react-router-dom";
import React from "react";

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div>
        <p className="eyebrow">{job.company}</p>
        <h3>{job.title}</h3>
        <p className="muted">{job.location} · {job.workplace} · {job.type}</p>
      </div>
      <div className="tag-row">
        {job.skills?.slice(0, 4).map((skill) => <span className="tag" key={skill}>{skill}</span>)}
      </div>
      <div className="job-footer">
        <strong>{job.salary || "Not disclosed"}</strong>
        <Link className="text-link" to={`/jobs/${job._id}`}>View job →</Link>
      </div>
    </article>
  );
}
