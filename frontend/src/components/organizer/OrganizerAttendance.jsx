import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrganizerAttendance.css";

const OrganizerAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("ALL");
  const [attendanceList, setAttendanceList] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Preview modal
  const [previewData, setPreviewData] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ==================================================
  // Load Organizer Events
  // ==================================================
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/events/organizer/${user.id}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log("Event Load Error:", err));
  }, [user?.id]);

  // ==================================================
  // Fetch Attendance Records
  // ==================================================
  const fetchAttendance = () => {
    if (!user?.id) return;

    let url =
      selectedEventId === "ALL"
        ? `http://localhost:8080/api/applications/organizer/${user.id}`
        : `http://localhost:8080/api/applications/event/${selectedEventId}`;

    axios
      .get(url)
      .then((res) => {
        const approvedOnly = res.data.filter(
          (app) => app.status === "APPROVED"
        );
        setAttendanceList(approvedOnly);
      })
      .catch((err) => console.log("Attendance Fetch Error:", err));
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedEventId, user?.id]);

  // ==================================================
  // 🔁 Auto refresh every 60 seconds
  // ==================================================
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAttendance();
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedEventId, user?.id]);

  // ==================================================
  // Check if Event Started
  // ==================================================
  const isEventStarted = (eventDate) => {
    if (!eventDate) return false;

    const startDateStr = eventDate.split(" to ")[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDay = new Date(startDateStr);
    eventDay.setHours(0, 0, 0, 0);

    return today >= eventDay;
  };

  // ==================================================
  // Mark Attendance
  // ==================================================
  const markAttendance = (id, status) => {
    axios
      .put(
        `http://localhost:8080/api/applications/attendance/${id}?status=${status}`
      )
      .then(() => {
        alert("Attendance Updated Successfully!");
        fetchAttendance();
      })
      .catch((err) => console.log("Attendance Update Error:", err));
  };

  // ==================================================
  // Issue Certificate
  // ==================================================
  const issueCertificate = async (volunteerId, eventId) => {
    const reference = prompt("Enter Certificate Reference Number:");

    if (reference === null) return;

    if (!reference || reference.trim() === "") {
      alert("Reference Number is required!");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/certificates/generate?volunteerId=${volunteerId}&eventId=${eventId}&reference=${reference}`
      );

      alert("✅ Certificate Issued Successfully!");

      window.open(
        `http://localhost:8080/api/certificates/download/${res.data.id}`,
        "_blank"
      );

      setPreviewData(null);
    } catch (err) {
      alert("❌ Certificate already issued!");
    }
  };

  // Preview
  const previewCertificate = (app) => {
    setPreviewData(app);
  };

  // ==================================================
  // Summary
  // ==================================================
  const totalVolunteers = attendanceList.length;

  const presentCount = attendanceList.filter(
    (a) => a.attendanceStatus === "PRESENT"
  ).length;

  const absentCount = attendanceList.filter(
    (a) => a.attendanceStatus === "ABSENT"
  ).length;

  const attendancePercentage =
    totalVolunteers === 0
      ? 0
      : Math.round((presentCount / totalVolunteers) * 100);

  // ==================================================
  // Search Filter
  // ==================================================
  const filteredList = attendanceList.filter((app) =>
    (app.volunteerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ==================================================
  // UI
  // ==================================================
  return (
    <div className="attendance-page">
      <h2 className="attendance-title">📌 Attendance Dashboard</h2>

      {/* Summary */}
      <div className="attendance-summary">
        <div className="summary-card">
          <h3>Total Volunteers</h3>
          <p>{totalVolunteers}</p>
        </div>

        <div className="summary-card present-card">
          <h3>Present</h3>
          <p>{presentCount}</p>
        </div>

        <div className="summary-card absent-card">
          <h3>Absent</h3>
          <p>{absentCount}</p>
        </div>

        <div className="summary-card percent-card">
          <h3>Attendance %</h3>
          <p>{attendancePercentage}%</p>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="attendance-filter">
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="ALL">🌍 All Events</option>

          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 Search Volunteer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Volunteer Cards */}
      <div className="attendance-card-grid">
        {filteredList.length === 0 ? (
          <p className="no-data">✅ No Volunteers Found</p>
        ) : (
          filteredList.map((app) => {
            const started = isEventStarted(app.eventDate);

            const totalDays = app.totalDays || 1;
            const attendedDays = app.attendedDays || 0;

            let currentDay = 1;

            if (app.eventDate) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (app.eventDate.includes(" to ")) {
                const parts = app.eventDate.split(" to ");
                const start = new Date(parts[0]);
                const end = new Date(parts[1]);

                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);

                if (today < start) currentDay = 1;
                else if (today > end) currentDay = totalDays;
                else {
                  const diff = Math.floor(
                    (today - start) / (1000 * 60 * 60 * 24)
                  );
                  currentDay = diff + 1;
                }
              }
            }

            let volunteerPercent = 0;

            if (totalDays === 1) {
              volunteerPercent =
                app.attendanceStatus === "PRESENT" ? 100 : 0;
            } else {
              const safeAttendedDays = Math.min(
                attendedDays,
                currentDay
              );

              volunteerPercent =
                totalDays === 0
                  ? 0
                  : Math.round(
                      (safeAttendedDays / totalDays) * 100
                    );
            }

            const isFinalDay = currentDay === totalDays;
            const eligible = volunteerPercent >= 75;
            const showPreview =
              totalDays === 1 || app.attendanceCompleted === true;

            return (
              <div className="attendance-card" key={app.id}>
                <div className="card-header">
                  <h3 className="volunteer-name">
                    {app.volunteerName}
                  </h3>
                  <span className="day-label">
                    Day {currentDay}
                  </span>
                </div>

                <p>
                  <b>Event:</b> {app.eventTitle}
                </p>

                <p>
                  <b>Date:</b> {app.eventDate || "N/A"}
                </p>

                {totalDays > 1 && (
                  <>
                    <p>
                      <b>Attendance:</b> {attendedDays} / {totalDays} days
                    </p>

                    <div className="day-buttons">
                      {[...Array(totalDays)].map((_, index) => {
                        const dayNumber = index + 1;

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        let eventEnded = false;

                        if (
                          app.eventDate &&
                          app.eventDate.includes(" to ")
                        ) {
                          const parts = app.eventDate.split(" to ");
                          const end = new Date(parts[1]);
                          end.setHours(0, 0, 0, 0);
                          eventEnded = today > end;
                        }

                        const isCompleted =
                          dayNumber <= attendedDays;
                        const isToday =
                          dayNumber === currentDay;

                        let disableButton;

                        if (eventEnded) {
                          disableButton = isCompleted;
                        } else {
                          disableButton =
                            !isToday || isCompleted;
                        }

                        return (
                          <button
                            key={index}
                            className={`day-btn ${
                              isCompleted
                                ? "completed"
                                : ""
                            }`}
                            disabled={disableButton}
                            onClick={() =>
                              markAttendance(
                                app.id,
                                "PRESENT"
                              )
                            }
                          >
                            {isCompleted
                              ? `✔ Day ${dayNumber}`
                              : `Day ${dayNumber}`}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {totalDays === 1 && (
                  <span
                    className={`status-badge ${app.attendanceStatus}`}
                  >
                    {app.attendanceStatus}
                  </span>
                )}

                {isFinalDay ? (
                  <p
                    className={
                      eligible
                        ? "eligible-text"
                        : "not-eligible-text"
                    }
                  >
                    {eligible
                      ? `✅ Eligible (${volunteerPercent}%)`
                      : `❌ Not Eligible (${volunteerPercent}%)`}
                  </p>
                ) : (
                  <p className="progress-text">
                    Attendance: {volunteerPercent}%
                  </p>
                )}

                <div className="card-actions">
                  {totalDays === 1 &&
                  app.attendanceStatus === "NOT_MARKED" ? (
                    started ? (
                      <>
                        <button
                          className="present-btn"
                          onClick={() =>
                            markAttendance(
                              app.id,
                              "PRESENT"
                            )
                          }
                        >
                          ✔ Present
                        </button>

                        <button
                          className="absent-btn"
                          onClick={() =>
                            markAttendance(
                              app.id,
                              "ABSENT"
                            )
                          }
                        >
                          ✖ Absent
                        </button>
                      </>
                    ) : (
                      <span className="pending-msg">
                        ⏳ Attendance Not Started
                      </span>
                    )
                  ) : eligible && showPreview ? (
                    <button
                      className="view-btn"
                      onClick={() =>
                        previewCertificate(app)
                      }
                    >
                      👁 Preview Certificate
                    </button>
                  ) : isFinalDay ? (
                    <span className="no-cert-msg">
                      🚫 No Certificate
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="preview-modal">
          <div className="preview-box">
            <h2>🎓 Certificate Preview</h2>

            <div className="certificate-preview">
              <h3>Certificate of Participation</h3>
              <p>This is proudly awarded to</p>
              <h1>{previewData.volunteerName}</h1>
              <p>For participating in the event</p>
              <h2>{previewData.eventTitle}</h2>
              <p>Date: {previewData.eventDate}</p>
            </div>

            <div className="modal-actions">
              <button
                className="certificate-btn"
                onClick={() =>
                  issueCertificate(
                    previewData.volunteerId,
                    previewData.eventId
                  )
                }
              >
                ✅ Confirm & Issue
              </button>

              <button
                className="absent-btn"
                onClick={() =>
                  setPreviewData(null)
                }
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerAttendance;
