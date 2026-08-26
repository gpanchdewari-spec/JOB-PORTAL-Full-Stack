import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const {user}   = useAuth()
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill">Built for candidates & recruiters</span>
            <h1>Find work that moves your career forward.</h1>
            <p>
              Search quality openings, upload your resume, apply in minutes, and
              track every application from one clean dashboard.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/jobs">
                Explore jobs
              </Link>
              {user ? (
                <Link
                  className="btn btn-secondary btn-lg"
                  to={user.role === "recruiter" ? "/recruiter" : "/candidate"}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link className="btn btn-secondary btn-lg" to="/register">
                  Create Account
                </Link>
              )}
            </div>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Live opportunity feed</p>
            <h2>Junior MERN Developer</h2>
            <p className="muted">Lucknow · Hybrid</p>
            <div className="metric-grid">
              <div>
                <strong>120+</strong>
                <span>Open roles</span>
              </div>
              <div>
                <strong>48h</strong>
                <span>Avg. response</span>
              </div>
            </div>
            <div className="status-line">
              <span className="dot" /> Applications open
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-head">
          <span className="pill">How it works</span>
          <h2>Simple for candidates. Powerful for recruiters.</h2>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span>01</span>
            <h3>Create profile</h3>
            <p>Add skills, location and a PDF resume.</p>
          </div>
          <div className="feature">
            <span>02</span>
            <h3>Apply smarter</h3>
            <p>Search jobs and track application status.</p>
          </div>
          <div className="feature">
            <span>03</span>
            <h3>Hire faster</h3>
            <p>Recruiters post roles and review applicants.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
