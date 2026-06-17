import React, { useEffect, useState } from "react";
import axios from "axios";
import "./myevents.css";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ Feedback States
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    axios
      .get(`https://volunteer-hub-jp64.onrender.com/api/applications/volunteer/${user.id}/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ CANCEL PARTICIPATION
  const cancelParticipation = async (eventId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !eventId) return;

    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      await axios.put("https://volunteer-hub-jp64.onrender.com/api/applications/cancel", null, {
        params: {
          volunteerId: user.id,
          eventId,
        },
      });

      alert("Participation cancelled");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data || "Cancel failed");
    }
  };

  // ==================================================
  // ✅ Submit Feedback Function
  // ==================================================
  const submitFeedback = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!feedbackEvent) return;

    try {
      const res = await axios.post(
        "https://volunteer-hub-jp64.onrender.com/api/feedback/submit",
        {
          eventId: feedbackEvent.eventId,
          volunteerId: user.id,
          rating,
          comment,
        }
      );

      if (res.data === "FEEDBACK_SAVED") {
        alert("✅ Thank you for your feedback!");
        setShowFeedback(false);
        setComment("");
        setRating(5);
      }

      if (res.data === "ALREADY_GIVEN") {
        alert("⚠️ Feedback already submitted!");
        setShowFeedback(false);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Feedback submission failed");
    }
  };

  // 🔹 FINAL getEventState
  const getEventState = (event) => {
    const now = new Date();

    if (event.status === "PENDING") {
      return "PENDING";
    }

    if (event.status === "CANCELLED" || event.status === "REJECTED") {
      const baseDate = event.statusUpdatedAt
        ? new Date(event.statusUpdatedAt)
        : new Date(`${event.startDate}T${event.startTime}`);

      const expiry = new Date(baseDate);
      expiry.setDate(expiry.getDate() + 2);

      return now <= expiry ? event.status : "EXPIRED";
    }

    if (!event.startDate || !event.startTime || !event.endTime) {
      return "APPROVED";
    }

    const start = new Date(`${event.startDate}T${event.startTime}`);
    let end = new Date(`${event.startDate}T${event.endTime}`);

    if (event.endTime < event.startTime) {
      end.setDate(end.getDate() + 1);
    }

    const completedExpiry = new Date(end);
    completedExpiry.setDate(completedExpiry.getDate() + 2);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    if (now > end && now <= completedExpiry) return "COMPLETED";

    return "EXPIRED";
  };

  // 🔹 FILTER LOGIC
  const filteredEvents = events.filter((event) => {
    const state = getEventState(event);

    if (state === "EXPIRED") return false;

    if (filter === "All") return true;
    return state === filter;
  });

  return (
    <div className="my-events-container">
      <h2 className="section-title">My Events</h2>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {[
          "All",
          "PENDING",
          "UPCOMING",
          "LIVE",
          "COMPLETED",
          "CANCELLED",
          "REJECTED",
        ].map((tab) => (
          <button
            key={tab}
            className={filter === tab ? "active-tab" : ""}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EVENT LIST */}
      <div className="event-list">
        {filteredEvents.length === 0 ? (
          <p className="empty-message">No events found</p>
        ) : (
          filteredEvents.map((event) => {
            const state = getEventState(event);

            return (
              <div key={event.eventId} className="event-card">
                <div className="event-date-time">
                  {event.startDate} | {event.startTime} - {event.endTime}
                </div>

                <h3>{event.title}</h3>

                <span className={`status-badge status-${state.toLowerCase()}`}>
                  {state}
                </span>

                <div className="event-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                  >
                    View Details
                  </button>

                  {/* Cancel only if UPCOMING */}
                  {state === "UPCOMING" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelParticipation(event.eventId)}
                    >
                      Cancel Participation
                    </button>
                  )}

                  {/* ✅ Feedback Button ONLY if COMPLETED */}
                  {state === "COMPLETED" && (
                    <button
                      className="feedback-btn"
                      onClick={() => {
                        setFeedbackEvent(event);
                        setShowFeedback(true);
                      }}
                    >
                      ⭐ Give Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================================================
          ✅ FEEDBACK MODAL
      ================================================== */}
      {showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-box">
            <h2>Event Feedback</h2>

            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Poor</option>
              <option value="1">⭐ Very Bad</option>
            </select>

            <label>Comment</label>
            <textarea
              rows="4"
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="feedback-actions">
              <button className="submit-btn" onClick={submitFeedback}>
                Submit
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL (Event Details) */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>

            <h2 className="modal-title">
              {selectedEvent.title || "Event Details"}
            </h2>

            <div className="modal-section">
              <h3>📌 Basic Event Information</h3>
              <p>
                <strong>Category:</strong> {selectedEvent.category || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedEvent.eventDescription ||
                  selectedEvent.description ||
                  "No description provided"}
              </p>
            </div>

            <div className="modal-section">
              <h3>📅 Date & Time</h3>
              <p>
                <strong>Start:</strong> {selectedEvent.startDate} |{" "}
                {selectedEvent.startTime}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {selectedEvent.endDate || selectedEvent.startDate} |{" "}
                {selectedEvent.endTime}
              </p>
            </div>

            <div className="modal-section">
              <h3>📍 Location Details</h3>
              <p>
                <strong>Location Name:</strong>{" "}
                {selectedEvent.locationName || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedEvent.address || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {selectedEvent.city || "N/A"}
              </p>
              <p>
                <strong>Area / Zone:</strong> {selectedEvent.area || "N/A"}
              </p>

              {selectedEvent.mapLink && (
                <a
                  href={selectedEvent.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  📍 View on Map
                </a>
              )}
            </div>

            <div className="modal-section">
              <h3>👥 Volunteer Requirements</h3>
              <p>
                <strong>Required Volunteers:</strong>{" "}
                {selectedEvent.totalSlots || "N/A"}
              </p>
              <p>
                <strong>Skills Required:</strong>{" "}
                {selectedEvent.skills || "Any"}
              </p>
              <p>
                <strong>Minimum Age:</strong>{" "}
                {selectedEvent.minAge || "No limit"}
              </p>
              <p>
                <strong>Gender Preference:</strong>{" "}
                {selectedEvent.genderPref || "Any"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
