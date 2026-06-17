import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import OrganizerNotifications from "./OrganizerNotifications";
import axios from "axios";
import "./OrganizerLayout.css";

const OrganizerLayout = () => {
  const navigate = useNavigate();

  // 🔔 notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔄 Fetch unread count (on dropdown open/close — EXISTING LOGIC)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    axios
      .get(
        `http://https://volunteer-hub-jp64.onrender.com/api/notifications/organizer/${user.id}/unread-count`
      )
      .then((res) => setUnreadCount(res.data))
      .catch(() => setUnreadCount(0));
  }, [showNotifications]);

  // ✅ AUTO REFRESH UNREAD COUNT EVERY 5s
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    const fetchUnread = () => {
      axios
        .get(
          `http://https://volunteer-hub-jp64.onrender.com/api/notifications/organizer/${user.id}/unread-count`
        )
        .then((res) => setUnreadCount(res.data))
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Close notifications when clicking outside (FIXED)
  useEffect(() => {
    const closeNotifications = (e) => {
      if (e.target.closest(".notification-dropdown")) return;
      setShowNotifications(false);
    };

    window.addEventListener("click", closeNotifications);
    return () => window.removeEventListener("click", closeNotifications);
  }, []);

  // 🔔 Bell click handler
  const toggleNotifications = (e) => {
    e.stopPropagation();

    setShowNotifications((prev) => {
      if (!prev) {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return true;

        const user = JSON.parse(storedUser);

        axios
          .put(
            `http://https://volunteer-hub-jp64.onrender.com/api/notifications/organizer/${user.id}/mark-read`
          )
          .then(() => setUnreadCount(0))
          .catch(() => {});
      }

      return !prev;
    });
  };

  // ✅ Logout FIX (Clear Session)
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="od-container">
      {/* Sidebar */}
      <aside className="od-sidebar">
        <div className="od-logo">VH</div>

        <nav>
          <NavLink
            to="/organizer"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/organizer/create-event"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Create Event
          </NavLink>

          <NavLink
            to="/organizer/my-events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Events
          </NavLink>

          <NavLink
            to="/organizer/volunteer"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Volunteer
          </NavLink>

          <NavLink
            to="/organizer/attendance"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Attendance
          </NavLink>

          <NavLink
            to="/organizer/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Reports
          </NavLink>

          

          {/* ✅ NEW: Help & Support */}
          <NavLink
            to="/organizer/help"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Help & Support
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="od-main">
        {/* Header */}
        <header className="od-header">
          <div className="od-header-right">
            <span className="role-badge">Organizer</span>

            {/* 🔔 Notification Bell */}
            <span
              className="od-bell"
              title="Notifications"
              onClick={toggleNotifications}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </span>

            {/* 🔽 Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown">
                <OrganizerNotifications refreshKey={unreadCount} />
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Routed pages */}
        <div className="od-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;
