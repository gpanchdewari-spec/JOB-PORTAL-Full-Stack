import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>
              Nexora<span>Hire</span>
            </h2>

            <p>
              Find the right opportunity, connect with recruiters, and grow your
              career with JobFlow.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn">
                in
              </a>

              <a href="#" aria-label="GitHub">
                GH
              </a>

              <a href="#" aria-label="Twitter">
                X
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h3>Quick Links</h3>

              <Link to="/">Home</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>

            <div>
              <h3>For Candidates</h3>

              <Link to="/jobs">Find Jobs</Link>
              <Link to="/candidate">Dashboard</Link>
              <Link to="/candidate">My Applications</Link>
              <Link to="/candidate">Upload Resume</Link>
            </div>

            <div>
              <h3>For Recruiters</h3>

              <Link to="/recruiter">Dashboard</Link>
              <Link to="/recruiter">Post a Job</Link>
              <Link to="/recruiter">Manage Jobs</Link>
              <Link to="/recruiter">View Applicants</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} JobFlow. All rights reserved.</p>

          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
