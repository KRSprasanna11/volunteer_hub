import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrganizerNotifications.css";

const OrganizerNotifications = ({ refreshKey }) => {
  const [notifications, setNotifications] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // 🔔 Fetch notifications
  useEffect(() => {
    if (!user) return;

    axios
      .get(
        `https://volunteer-hub-jp64.onrender.com/api/notifications/organizer/${user.id}`
      )
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, [refreshKey]);

  // 🗑 DELETE SINGLE NOTIFICATION
  const deleteSingleNotification = (id) => {
    axios
      .delete(`https://volunteer-hub-jp64.onrender.com/api/notifications/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== id)
        );
      })
      .catch(() => {});
  };

  return (
    <div
      className="notification-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="notification-header">
        <span>Notifications</span>
      </div>

      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="notification-item">
            <span className="notification-text">
              🔔 {n.message}
            </span>

            {/* ❌ Single delete */}
            <button
              className="delete-btn"
              onClick={() => deleteSingleNotification(n.id)}
              title="Delete"
            >
              ✖
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrganizerNotifications;
