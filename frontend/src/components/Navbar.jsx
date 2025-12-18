import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          mini<span>Events</span>
        </Link>
        {user && (
          <nav className="nav-links">
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className={location.pathname === "/create" ? "active" : ""}
            >
              Create
            </Link>
            <Link
              to="/my-events"
              className={location.pathname === "/my-events" ? "active" : ""}
            >
              My Events
            </Link>
          </nav>
        )}
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn-outline" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
