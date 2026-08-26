import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Applicants() {
  const { jobId } = useParams();
  const [data, setData] = useState({ job: null, applications: [] });
  const [error, setError] = useState("");
  const load = () =>
    api
      .get(`/applications/job/${jobId}`)
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load applicants"),
      );

  useEffect(() => {
    load();
  }, [jobId]);

  const update = async (id, status) => {
    await api.patch(`/applications/${id}/status`, { status });
    load();
  };
  return (
    <main className="section container">
      <div className="section-head">
        <span className="pill">Applicant pipeline</span>
        <h1>{data.job?.title || "Applicants"}</h1>
        <p className="muted">{data.job?.company}</p>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="applicant-list">
        {data.applications.length ? (
          data.applications.map((a) => (
            <article className="applicant-card" key={a._id}>
              <div>
                <h3>{a.candidate?.name}</h3>
                <p>{a.candidate?.headline || a.candidate?.email}</p>
                <p className="muted small">{a.candidate?.location}</p>
                <div className="tag-row">
                  {a.candidate?.skills?.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="applicant-actions">
                {a.candidate?.resumeUrl ? (
                  <a
                    className="btn btn-secondary"
                    href={a.candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View resume
                  </a>
                ) : (
                  <span className="muted small">No resume</span>
                )}
                <select
                  value={a.status}
                  onChange={(e) => update(a._id, e.target.value)}
                >
                  <option value="applied">Applied</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              {a.coverLetter && (
                <p className="cover-letter">
                  <strong>Cover letter:</strong> {a.coverLetter}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="empty">
            <h3>No applicants yet</h3>
            <p>Applications will appear here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
