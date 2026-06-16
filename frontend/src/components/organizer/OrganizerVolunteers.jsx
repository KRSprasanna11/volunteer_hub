import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrganizerVolunteers.css";

const OrganizerVolunteers = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("ALL");
  const [applications, setApplications] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ===========================
     LOAD ORGANIZER EVENTS
  ============================ */
  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();

    axios
      .get(`http://localhost:8080/api/events/organizer/${user.id}`, {
        signal: controller.signal,
      })
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));

    return () => controller.abort();
  }, [user?.id]);

  /* ===========================
     LOAD VOLUNTEER APPLICATIONS
  ============================ */
  const loadApplications = () => {
    if (!user?.id) return;

    const url =
      selectedEventId === "ALL"
        ? `http://localhost:8080/api/applications/organizer/${user.id}`
        : `http://localhost:8080/api/applications/event/${selectedEventId}`;

    axios
      .get(url)
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    loadApplications();
  }, [selectedEventId, user?.id]);

  /* ===========================
     APPROVE / REJECT
  ============================ */
  const updateStatus = (id, status) => {
    axios
      .put(
        `http://localhost:8080/api/applications/${id}/${status.toLowerCase()}`
      )
      .then(() => {
        alert(`Volunteer ${status} Successfully!`);
        loadApplications();
      })
      .catch(() => {
        alert("Failed to update status");
      });
  };

  /* ===========================
     ✅ REMOVE VOLUNTEER (ONLY APPROVED)
  ============================ */
  const removeVolunteer = (id) => {
    if (!window.confirm("Are you sure you want to remove this volunteer?"))
      return;

    axios
      .put(`http://localhost:8080/api/applications/${id}/remove`)
      .then(() => {
        alert("Volunteer Removed Successfully!");

        // ✅ Update UI instantly (without waiting)
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: "REMOVED" } : app
          )
        );
      })
      .catch(() => {
        alert("Failed to remove volunteer");
      });
  };

  /* ===========================
     STATS
  ============================ */
  const stats = {
    applied: applications.length,
    approved: applications.filter((a) => a.status === "APPROVED").length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
    cancelled: applications.filter((a) => a.status === "CANCELLED").length,
    removed: applications.filter((a) => a.status === "REMOVED").length,
  };

  return (
    <div className="volunteer-page">
      <h2 className="page-title">Volunteers</h2>
      <p className="page-subtitle">Manage volunteers for your events</p>

      {/* 🔽 EVENT SELECTOR */}
      <select
        className="event-select"
        value={selectedEventId}
        onChange={(e) => setSelectedEventId(e.target.value)}
      >
        <option value="ALL">All Events</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>

      {/* 📊 STATS */}
      <div className="volunteer-stats">
        <div>Applied: {stats.applied}</div>
        <div>Approved: {stats.approved}</div>
        <div>Pending: {stats.pending}</div>
        <div>Rejected: {stats.rejected}</div>
        <div>Cancelled: {stats.cancelled}</div>
        <div>Removed: {stats.removed}</div>
      </div>

      {/* 📋 VOLUNTEER TABLE */}
      <table className="volunteer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty">
                No volunteers found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.volunteerName}</td>
                <td>{app.volunteerEmail}</td>

                {/* ✅ STATUS */}
                <td>
                  <span className={`status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>

                {/* ✅ ACTIONS */}
                <td>
                  {/* Pending */}
                  {app.status === "PENDING" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => updateStatus(app.id, "APPROVED")}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => updateStatus(app.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Approved */}
                  {app.status === "APPROVED" && (
                    <>
                      <span className="action-text approved">✔ Approved</span>

                      <button
                        className="remove-btn"
                        style={{ marginLeft: "10px" }}
                        onClick={() => removeVolunteer(app.id)}
                      >
                        🗑 Remove
                      </button>
                    </>
                  )}

                  {/* Removed */}
                  {app.status === "REMOVED" && (
                    <span className="action-text removed">🗑 Removed</span>
                  )}

                  {/* Rejected */}
                  {app.status === "REJECTED" && (
                    <span className="action-text rejected">✖ Rejected</span>
                  )}

                  {/* Cancelled */}
                  {app.status === "CANCELLED" && (
                    <span className="action-text cancelled">🚫 Cancelled</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizerVolunteers;
