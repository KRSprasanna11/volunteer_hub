import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHistory.css";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");

  // ✅ Feedback States
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // ==================================================
  // ✅ Load Volunteer History
  // ==================================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    axios
      .get(`http://localhost:8080/api/applications/volunteer/${user.id}/history`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ==================================================
  // ✅ Submit Feedback Function
  // ==================================================
  const submitFeedback = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!selectedEvent) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/feedback/submit",
        {
          eventId: selectedEvent.eventId,
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
      alert("❌ Submission failed");
    }
  };

  // ==================================================
  // ✅ FILTERED HISTORY
  // ==================================================
  const filteredHistory = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  // ==================================================
  // ✅ UI
  // ==================================================
  return (
    <div className="history-container">
      <h2 className="section-title">History</h2>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {["ALL", "COMPLETED", "CANCELLED", "REJECTED"].map((tab) => (
          <button
            key={tab}
            className={filter === tab ? "active-tab" : ""}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HISTORY LIST */}
      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <p className="empty-message">No history found</p>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.eventId} className="history-card">
              {/* DATE */}
              <div className="event-date-time">
                {item.startDate} | {item.startTime} - {item.endTime}
              </div>

              <h3>{item.title}</h3>

              <p>
                <b>Organizer:</b> {item.organizerName || "N/A"}
              </p>

              {/* STATUS */}
              <span
                className={`status-badge status-${item.status.toLowerCase()}`}
              >
                {item.status}
              </span>

              {/* ✅ FEEDBACK BUTTON ONLY FOR COMPLETED */}
              {item.status === "COMPLETED" && (
                <button
                  className="feedback-btn"
                  onClick={() => {
                    setSelectedEvent(item);
                    setShowFeedback(true);
                  }}
                >
                  ⭐ Give Feedback
                </button>
              )}

              {/* ✅ REPORT BUTTON ONLY FOR CANCELLED */}
              {item.status === "CANCELLED" && (
                <button
                  className="cancel-report-btn"
                  onClick={() => {
                    setSelectedEvent(item);
                    setShowFeedback(true);

                    // Cancelled events → no rating needed
                    setRating(0);
                  }}
                >
                  📝 Report Cancelled Event
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ==================================================
          ✅ FEEDBACK MODAL POPUP
      ================================================== */}
      {showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-box">
            <h2>
              {selectedEvent?.status === "CANCELLED"
                ? "Cancelled Event Report"
                : "Event Feedback"}
            </h2>

            {/* Rating ONLY for Completed */}
            {selectedEvent?.status === "COMPLETED" && (
              <>
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
              </>
            )}

            {/* Comment */}
            <label>
              {selectedEvent?.status === "CANCELLED"
                ? "Reason / Complaint"
                : "Comment"}
            </label>

            <textarea
              rows="4"
              placeholder="Write here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Buttons */}
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
    </div>
  );
};

export default VolunteerHistory;
