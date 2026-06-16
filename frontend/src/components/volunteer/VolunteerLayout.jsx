import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import "./volunteerdashboard.css";

const VolunteerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // later you can also clear token/localStorage here
    navigate("/");   // redirect to landing / login
  };

  return (
    <div className="vd-container">

      {/* Sidebar */}
      <aside className="vd-sidebar">
        <div className="vd-logo">VH</div>

        <nav>
          <NavLink
            to="/volunteer"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/volunteer/available-events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Available Events
          </NavLink>

          <NavLink
            to="/volunteer/my-events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Events
          </NavLink>

          <NavLink
            to="/volunteer/history"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            History
          </NavLink>

          <NavLink
            to="/volunteer/certificates"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Certificates
          </NavLink>

          <NavLink
            to="/volunteer/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>

          <NavLink
            to="/volunteer/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Settings
          </NavLink>

          {/* ✅ NEW: Help & Support */}
          <NavLink
            to="/volunteer/help"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Help & Support
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="vd-main">

        {/* Header */}
        <header className="vd-header">
          <div className="vd-header-right">
            <span className="role-badge">Volunteer</span>
            <span className="vd-bell" title="Notifications">🔔</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Routed pages */}
        <div className="vd-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default VolunteerLayout;
