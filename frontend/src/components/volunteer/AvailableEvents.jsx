import React, { useEffect, useState } from "react";
import axios from "axios";
import "./availableevent.css";

const AvailableEvents = () => {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);

  // filter states
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [skill, setSkill] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const volunteerId = user?.id;

  // ================= LOAD EVENTS + APPLICATIONS =================

  useEffect(() => {
    loadEvents();
    if (volunteerId) loadApplications();
  }, [volunteerId]);

  const loadEvents = async () => {
    try {
      const res = await axios.get("http://https://volunteer-hub-jp64.onrender.com/api/events/available");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await axios.get(
        `http://https://volunteer-hub-jp64.onrender.com/api/applications/volunteer/${volunteerId}`
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // ================= FIND APPLICATION (FIXED MATCHING) =================

  const getApplication = (eventId) => {
    return applications.find(
      (a) => Number(a.eventId) === Number(eventId)
    );
  };

  // ================= HELPER FUNCTIONS =================

  const getRegistrationStatus = (event) => {
    if (!event.registrationEndDate || !event.registrationEndTime) {
      return "OPEN";
    }

    const end = new Date(
      `${event.registrationEndDate}T${event.registrationEndTime}`
    );
    const now = new Date();

    return now <= end ? "OPEN" : "CLOSED";
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(`${event.startDate}T${event.startTime}`);
    const end = new Date(
      `${event.endDate || event.startDate}T${event.endTime}`
    );

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "COMPLETED";
  };

  const isWithinGracePeriod = (event) => {
    if (!event.registrationEndDate || !event.registrationEndTime) {
      return true;
    }

    const regEnd = new Date(
      `${event.registrationEndDate}T${event.registrationEndTime}`
    );

    const graceEnd = new Date(regEnd);
    graceEnd.setDate(graceEnd.getDate() + 2);

    const now = new Date();
    return now <= graceEnd;
  };

  const isEventActive = (event) => {
    if (!event.startDate || !event.endTime) return true;

    const endDate = event.endDate || event.startDate;
    const eventEndDateTime = new Date(`${endDate}T${event.endTime}`);
    const now = new Date();

    if (now > eventEndDateTime) return false;

    if (getRegistrationStatus(event) === "CLOSED") {
      return isWithinGracePeriod(event);
    }

    return true;
  };

  // ================= APPLY LOGIC =================

  const handleApply = async (eventId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        "http://https://volunteer-hub-jp64.onrender.com/api/applications/apply",
        null,
        {
          params: {
            eventId,
            volunteerId: user.id,
          },
        }
      );

      if (res.data === "APPLIED") {
        alert("Applied successfully!");
      }

      if (res.data === "ALREADY_APPLIED") {
        alert("You already applied for this event");
      }

      if (res.data === "REGISTRATION_CLOSED") {
        alert("Registration is closed for this event");
        return;
      }

      if (res.data === "SLOTS_FULL") {
        alert("No slots available. Event is full");
        return;
      }

      if (res.data === "EVENT_CANCELLED") {
        alert("This event was cancelled by organizer");
        return;
      }

      // ✅ Always refresh UI after apply attempt
      await loadApplications();
      await loadEvents();
    } catch (err) {
      console.error("Apply Error:", err);
      alert("Apply failed");
    }
  };

  // ================= ACTION BUTTON (FINAL MERGE FIX) =================

  const renderAction = (event) => {
    const application = getApplication(event.id);
    const regStatus = getRegistrationStatus(event);

    // Not applied yet
    if (!application) {
      return (
        <button
          className="ae-btn-secondary"
          disabled={regStatus === "CLOSED"}
          onClick={() => handleApply(event.id)}
        >
          {regStatus === "CLOSED" ? "Registration Closed" : "Apply"}
        </button>
      );
    }

    // ✅ FIX: Normalize status (Merged from Code-1)
    const status = application.status?.toUpperCase();

    if (status === "PENDING")
      return <span className="status pending">Pending</span>;

    if (status === "APPROVED")
      return <span className="status approved">Approved</span>;

    if (status === "REJECTED")
      return <span className="status rejected">Rejected</span>;

    if (status === "CANCELLED")
      return <span className="status cancelled">Cancelled</span>;

    return null;
  };

  // ================= FILTER EVENTS =================

  const filteredEvents = events.filter((event) => {
    if (event.status === "Cancelled") return false;

    const searchMatch =
      event.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchText.toLowerCase()) ||
      event.organizerName?.toLowerCase().includes(searchText.toLowerCase());

    const locationMatch =
      event.city?.toLowerCase().includes(locationText.toLowerCase()) ||
      event.locationName?.toLowerCase().includes(locationText.toLowerCase());

    const skillMatch =
      skill === "" ||
      event.skills?.toLowerCase().includes(skill.toLowerCase());

    return searchMatch && locationMatch && skillMatch && isEventActive(event);
  });

  // ================= UI =================

  return (
    <div className="ae-container">
      <h2 className="ae-title">Available Events</h2>

      {/* FILTER BAR */}
      <div className="ae-filter-bar">
        <input
          type="text"
          className="ae-search"
          placeholder="🔍 Search events, organizer"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <input
          type="text"
          className="ae-search"
          placeholder="📍 Location"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
        />

        <select
          className="ae-select"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        >
          <option value="">🛠 Skill</option>
          <option value="cleaning">Cleaning</option>
          <option value="technical">Technical</option>
          <option value="teaching">Teaching</option>
        </select>
      </div>

      {/* EVENT LIST */}
      <div className="ae-list">
        {filteredEvents.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            No events found
          </p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="ae-card">
              <div className="ae-card-header">
                <h3 className="ae-card-title">{event.title}</h3>

                <span className="ae-card-date">
                  {event.startDate} | {event.startTime} - {event.endTime}
                </span>

                <span
                  className={`reg-badge ${
                    getRegistrationStatus(event) === "OPEN"
                      ? "open"
                      : "closed"
                  }`}
                >
                  Registration {getRegistrationStatus(event)}
                </span>

                <span
                  className={`event-status ${getEventStatus(event).toLowerCase()}`}
                >
                  {getEventStatus(event)}
                </span>
              </div>

              <div className="ae-card-body">
                <div className="ae-info">
                  <p><strong>Category:</strong> {event.category}</p>
                  <p><strong>Organized by:</strong> {event.organizerName}</p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {event.locationName}, {event.area}, {event.city}
                  </p>
                  <p><strong>Address:</strong> {event.address}</p>
                  <p>
                    <strong>Skills Required:</strong>{" "}
                    {event.skills || "Any"}
                  </p>
                </div>

                <div className="ae-info">
                  <p><strong>Minimum Age:</strong> {event.minAge || "No limit"}</p>
                  <p><strong>Gender Preference:</strong> {event.genderPref || "Any"}</p>
                  <p>
                    <strong>Remaining Slots:</strong>{" "}
                    {event.remainingSlots ?? event.totalSlots}
                  </p>
                </div>
              </div>

              <div className="event-action">
                {renderAction(event)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableEvents;
