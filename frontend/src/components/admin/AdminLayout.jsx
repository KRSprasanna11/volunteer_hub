import React from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import "./AdminDashboard.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear admin session / token later
    navigate("/");
  };

  return (
    <div className="ad-container">

      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-logo">VH</div>

        <nav>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Users
          </NavLink>

         

         

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Complaints
          </NavLink>

         

          {/* NEW: Document Verification */}
          <NavLink
            to="/admin/document-verification"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Document Verification
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="ad-main">

        {/* Header */}
        <header className="ad-header">
          <div className="ad-header-right">
            <span className="role-badge admin">Admin</span>
            <span className="ad-bell" title="Notifications">🔔</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Routed pages */}
        <div className="ad-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
