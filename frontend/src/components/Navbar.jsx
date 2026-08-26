import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";


export default function Navbar() {
  const { user, logout } = useAuth();
const dashboard =
  user?.role === "admin"
    ? "/admin"
    : user?.role === "recruiter"
      ? "/recruiter"
      : "/candidate";

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="logoo" to="/">
          <img src="logo.png" alt="" />
        </Link>
        <Link className="brand" to="/">
          Nexora<span>Hire</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/jobs">Jobs</NavLink>
          {user && (
            <NavLink className="btnn" to={dashboard}>
              Dashboard
            </NavLink>
          )}
          {user ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link className="btn btn-primary" to="/register">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
