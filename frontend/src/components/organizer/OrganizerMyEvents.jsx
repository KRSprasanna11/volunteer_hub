import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrganizerMyEvents.css";
import VolunteerProfileModal from "./VolunteerProfileModal";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Draft: "status-draft",
  Published: "status-published",
  Ongoing: "status-ongoing",
  Completed: "status-completed",
  Cancelled: "status-cancelled",
};

const OrganizerMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);

  // ✅ Profile Modal State
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);

  // ✅ Filter State
  const [filter, setFilter] = useState("ALL");

  // ✅ Navigation Hook
  const navigate = useNavigate();

  // ✅ Organizer ID
  const storedUser = localStorage.getItem("user");
  const organizerId = storedUser ? JSON.parse(storedUser).id : null;

  // ==================================================
  // ✅ Load Organizer Events
  // ==================================================
  useEffect(() => {
    if (!organizerId) return;

    axios
      .get(`https://volunteer-hub-jp64.onrender.com/api/events/organizer/${organizerId}`)
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        setEvents([]);
      });
  }, [organizerId]);

  // ==================================================
  // ✅ AUTO LOAD APPLICATIONS FOR ALL EVENTS (COUNTS FIX)
  // ==================================================
  useEffect(() => {
    if (events.length === 0) return;

    const fetchAllApplications = async () => {
      try {
        let allApps = {};

        for (let event of events) {
          const res = await axios.get(
            `https://volunteer-hub-jp64.onrender.com/api/applications/event/${event.id}`
          );

          allApps[event.id] = res.data;
        }

        setApplications(allApps);
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    };

    fetchAllApplications();
  }, [events]);

  // ==================================================
  // ✅ Load Volunteers (Toggle + API Call)
  // ==================================================
  const loadVolunteers = async (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
      return;
    }

    try {
      const res = await axios.get(
        `https://volunteer-hub-jp64.onrender.com/api/applications/event/${eventId}`
      );

      setApplications((prev) => ({
        ...prev,
        [eventId]: res.data,
      }));

      setSelectedEventId(eventId);
    } catch (err) {
      console.error(err);
    }
  };

  // ==================================================
  // ✅ Approve Application (FIXED)
  // ==================================================
  const approve = async (applicationId, eventId) => {
    await axios.put(
      `https://volunteer-hub-jp64.onrender.com/api/applications/${applicationId}/status`,
      null,
      { params: { status: "APPROVED" } }
    );

    alert("Volunteer Approved!");

    // Refresh Applications List
    const res = await axios.get(
      `https://volunteer-hub-jp64.onrender.com/api/applications/event/${eventId}`
    );

    setApplications((prev) => ({
      ...prev,
      [eventId]: res.data,
    }));
  };

  // ==================================================
  // ✅ Reject Application (FIXED)
  // ==================================================
  const reject = async (applicationId, eventId) => {
    await axios.put(
      `https://volunteer-hub-jp64.onrender.com/api/applications/${applicationId}/status`,
      null,
      { params: { status: "REJECTED" } }
    );

    alert("Volunteer Rejected!");

    // Refresh Applications List
    const res = await axios.get(
      `https://volunteer-hub-jp64.onrender.com/api/applications/event/${eventId}`
    );

    setApplications((prev) => ({
      ...prev,
      [eventId]: res.data,
    }));
  };

  // ==================================================
  // ✅ Cancel Event
  // ==================================================
  const cancelEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel this event?")) return;

    try {
      await axios.put(`https://volunteer-hub-jp64.onrender.com/api/events/${eventId}/cancel`);

      alert("Event Cancelled Successfully!");

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId ? { ...ev, status: "Cancelled" } : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel event");
    }
  };

  // ==================================================
  // ✅ Helper to Classify Events
  // ==================================================
  const getEventType = (event) => {
    const today = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate || event.startDate);

    if (event.status === "Completed" || end < today) return "COMPLETED";
    if (event.status === "Ongoing" || (start <= today && end >= today))
      return "LIVE";
    if (start > today) return "UPCOMING";

    return "ALL";
  };

  // ==================================================
  // ✅ Count Helper Function
  // ==================================================
  const getCounts = (eventId) => {
    const apps = applications[eventId] || [];

    return {
      joined: apps.filter((a) => a.status === "APPROVED").length,
      pending: apps.filter((a) => a.status === "PENDING").length,
      approved: apps.filter((a) => a.status === "APPROVED").length,
      rejected: apps.filter((a) => a.status === "REJECTED").length,
      cancelled: apps.filter((a) => a.status === "CANCELLED").length,
    };
  };

  return (
    <div className="organizer-events-container">
      <h2 className="section-title">My Events (Organizer)</h2>

      {/* ✅ FILTER BUTTONS */}
      <div className="event-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "UPCOMING" ? "active" : ""}
          onClick={() => setFilter("UPCOMING")}
        >
          Upcoming
        </button>

        <button
          className={filter === "LIVE" ? "active" : ""}
          onClick={() => setFilter("LIVE")}
        >
          Live
        </button>

        <button
          className={filter === "COMPLETED" ? "active" : ""}
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>
      </div>

      {events.length === 0 && <p>No events created yet.</p>}

      {/* ✅ EVENT LIST */}
      {events
        .filter((event) => filter === "ALL" || getEventType(event) === filter)
        .map((event) => {
          const counts = getCounts(event.id);
          const remainingSlots = event.totalSlots - counts.approved;

          return (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>

              <p>
                <strong>Category:</strong> {event.category}
              </p>

              {/* ✅ FULL DATE + TIME DETAILS */}
              <p>
                <strong>Registration Start:</strong>{" "}
                {event.registrationStartDate} ({event.registrationStartTime})
              </p>

              <p>
                <strong>Registration End:</strong>{" "}
                {event.registrationEndDate} ({event.registrationEndTime})
              </p>

              <p>
                <strong>Event Start Date:</strong> {event.startDate}
              </p>

              <p>
                <strong>Event End Date:</strong>{" "}
                {event.endDate || event.startDate}
              </p>

              <p>
                <strong>Event Time:</strong> {event.startTime} – {event.endTime}
              </p>

              <p>
                <strong>Location:</strong> {event.locationName}, {event.city}
              </p>

              {/* ✅ Status Badge */}
              <p
                className={`status-badge ${
                  statusColors[event.status || "Published"]
                }`}
              >
                Status: {event.status || "Published"}
              </p>

              {/* ✅ Volunteer Summary */}
              <div className="volunteer-summary">
                <p>
                  <strong>Total Slots:</strong> {event.totalSlots}
                </p>

                <p>
                  <strong>Remaining Slots:</strong> {remainingSlots}
                </p>

                <p>
                  <strong>Joined:</strong> {counts.joined}
                </p>

                <p>
                  <strong>Pending:</strong> {counts.pending}
                </p>

                <p>
                  <strong>Rejected:</strong> {counts.rejected}
                </p>

                <p>
                  <strong>Cancelled:</strong> {counts.cancelled}
                </p>
              </div>

              {/* ✅ Volunteer Management Buttons */}
              <div className="volunteer-management">
                <button onClick={() => loadVolunteers(event.id)}>
                  {selectedEventId === event.id
                    ? "Hide Volunteer Requests"
                    : "View Volunteer Requests"}
                </button>

                <button>Send Message to Volunteers</button>
              </div>

              {/* ✅ Volunteer Applications */}
              {selectedEventId === event.id && (
                <div className="volunteer-list">
                  <h4>Volunteer Requests</h4>

                  {applications[event.id]?.length > 0 ? (
                    applications[event.id].map((app) => (
                      <div key={app.id} className="volunteer-item">
                        <p>
                          <strong>{app.volunteerName}</strong>
                        </p>
                        <p>{app.volunteerEmail}</p>
                        <p>Status: {app.status}</p>

                        <div className="volunteer-actions">
                          <button
                            onClick={() =>
                              setSelectedVolunteerId(app.volunteerId)
                            }
                          >
                            View Profile
                          </button>

                          {app.status === "PENDING" && (
                            <>
                              <button onClick={() => approve(app.id, event.id)}>
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() => reject(app.id, event.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No volunteer requests</p>
                  )}
                </div>
              )}

              {/* ✅ Event Actions */}
              <div className="event-actions">
                <button onClick={() => navigate(`/edit-event/${event.id}`)}>
                  Edit Event
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => cancelEvent(event.id)}
                  disabled={event.status === "Cancelled"}
                >
                  Cancel Event
                </button>

                <button>Notify Volunteers</button>
              </div>
            </div>
          );
        })}

      {/* ✅ PROFILE MODAL */}
      {selectedVolunteerId && (
        <VolunteerProfileModal
          volunteerId={selectedVolunteerId}
          onClose={() => setSelectedVolunteerId(null)}
        />
      )}
    </div>
  );
};

export default OrganizerMyEvents;
