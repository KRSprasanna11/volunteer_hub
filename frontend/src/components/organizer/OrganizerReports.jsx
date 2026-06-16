import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrganizerReports.css";

const OrganizerReports = () => {

  // ✅ MAIN FILTERED REPORT (Changes with Dropdown)
  const [report, setReport] = useState(null);

  // ✅ SUMMARY REPORT (Always Fixed Top Cards)
  const [summaryReport, setSummaryReport] = useState(null);

  // ✅ Dropdown Events List (All Organizer Events)
  const [events, setEvents] = useState([]);

  // ✅ Selected Event
  const [selectedEventId, setSelectedEventId] = useState("ALL");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ==================================================
  // ✅ Load SUMMARY Report (Always Same)
  // ==================================================
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/reports/organizer/${user.id}`)
      .then((res) => {
        setSummaryReport(res.data); // ✅ Top Cards Fixed
        setReport(res.data);        // Default view
      })
      .catch((err) => console.log("Report Error:", err));
  }, [user?.id]);

  // ==================================================
  // ✅ Load Organizer Events for Dropdown
  // ==================================================
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/events/organizer/${user.id}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log("Event Load Error:", err));
  }, [user?.id]);

  // ==================================================
  // ✅ Filter Participation + Attendance + Feedback
  // ==================================================
  useEffect(() => {
    if (!user?.id) return;

    let url =
      selectedEventId === "ALL"
        ? `http://localhost:8080/api/reports/organizer/${user.id}`
        : `http://localhost:8080/api/reports/organizer/${user.id}/event/${selectedEventId}`;

    axios
      .get(url)
      .then((res) => setReport(res.data))
      .catch((err) => console.log("Filter Error:", err));
  }, [selectedEventId, user?.id]);

  // Loading
  if (!report || !summaryReport) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  }

  // ✅ SAFE DEFAULTS (Prevents null / undefined errors)
  const safeComments = report.recentComments || [];

  return (
    <div className="reports-page">
      <h2 className="reports-title">📊 Organizer Reports</h2>

      {/* ==================================================
          ✅ TOP SUMMARY CARDS (ALWAYS FIXED)
      ================================================== */}
      <div className="reports-summary">
        <div className="report-card">
          <h3>Total Events</h3>
          <p>{summaryReport.totalEvents ?? 0}</p>
        </div>

        <div className="report-card">
          <h3>Completed</h3>
          <p>{summaryReport.completedEvents ?? 0}</p>
        </div>

        <div className="report-card">
          <h3>Upcoming</h3>
          <p>{summaryReport.upcomingEvents ?? 0}</p>
        </div>

        <div className="report-card">
          <h3>Cancelled</h3>
          <p>{summaryReport.cancelledEvents ?? 0}</p>
        </div>
      </div>

      {/* ==================================================
          ✅ PARTICIPATION (FILTERED)
      ================================================== */}
      <div className="reports-section">
        <h3>👥 Volunteer Participation</h3>

        <div className="reports-grid">
          <div className="mini-card">
            <span>Applied</span>
            <p>{report.totalApplications ?? 0}</p>
          </div>

          <div className="mini-card approved">
            <span>Approved</span>
            <p>{report.approved ?? 0}</p>
          </div>

          <div className="mini-card pending">
            <span>Pending</span>
            <p>{report.pending ?? 0}</p>
          </div>

          <div className="mini-card rejected">
            <span>Rejected</span>
            <p>{report.rejected ?? 0}</p>
          </div>
        </div>
      </div>

      {/* ==================================================
          ✅ ATTENDANCE (FILTERED)
      ================================================== */}
      <div className="reports-section">
        <h3>📌 Attendance Report</h3>

        <div className="reports-grid">
          <div className="mini-card present">
            <span>Present</span>
            <p>{report.presentCount ?? 0}</p>
          </div>

          <div className="mini-card absent">
            <span>Absent</span>
            <p>{report.absentCount ?? 0}</p>
          </div>

          <div className="mini-card percent">
            <span>Attendance %</span>
            <p>{report.attendancePercentage ?? 0}%</p>
          </div>
        </div>
      </div>

      {/* ==================================================
          ✅ FEEDBACK SUMMARY (FILTERED)
      ================================================== */}
      <div className="reports-section">
        <h3>⭐ Feedback Summary</h3>

        {/* ✅ Dropdown */}
        <div className="filter-dropdown">
          <label>Select Event:</label>

          <select
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
        </div>

        <div className="reports-grid">
          <div className="mini-card">
            <span>Total Feedback</span>
            <p>{report.feedbackCount ?? 0}</p>
          </div>

          <div className="mini-card rating">
            <span>Avg Rating</span>
            <p>⭐ {report.averageRating ?? 0}</p>
          </div>
        </div>

        {/* Comments */}
        <div className="feedback-box">
          <h4>Recent Comments</h4>

          {safeComments.length === 0 ? (
            <p>No feedback yet</p>
          ) : (
            safeComments.map((c, index) => (
              <p key={index}>💬 {c}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerReports;
