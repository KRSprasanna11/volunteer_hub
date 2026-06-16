import React from "react";
import NeonLineChart from "./NeonLineChart";
import NeonDonut from "./NeonDonut";
import NeonCircular from "./NeonCircular";
import OrganizerNotifications from "./OrganizerNotifications"; // ✅ NEW import
import "./OrganizerDashboard.css"; // organizer-specific styles

const OrganizerDashboard = () => {
  return (
    <>
      {/* Stats cards */}
      <div className="od-cards">
        <div className="od-card">
          <div className="od-card-title">Total Events</div>
          <div className="od-card-value">12</div>
        </div>

        <div className="od-card">
          <div className="od-card-title">Volunteers</div>
          <div className="od-card-value">58</div>
        </div>

        <div className="od-card">
          <div className="od-card-title">Attendance Rate</div>
          <div className="od-card-value">76%</div>
        </div>

        <div className="od-card">
          <div className="od-card-title">Messages</div>
          <div className="od-card-value">4</div>
        </div>
      </div>

      {/* Activity Overview */}
      <section className="od-section">
        <h3>Activity Overview</h3>

        <div className="od-multi-graphs">
          <div className="od-graph-card">
            <h4>Events Created Over Time</h4>
            <NeonLineChart points={[5, 12, 9, 15, 20, 18, 22]} />
          </div>

          {/* ✅ CENTERED NeonCircular */}
          <div className="od-graph-card">
            <h4>Volunteer Engagement</h4>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <NeonCircular value={80} label="Goal 100 volunteers" />
            </div>
          </div>

          <div className="od-graph-card">
            <h4>Attendance Ratio</h4>
            <NeonDonut value={76} label="Avg attendance" />
          </div>
        </div>
      </section>

      {/* Events Management */}
      <section className="od-section">
        <h3>Manage Events</h3>

        <div className="event-tabs">
          <button className="tab active">All Events</button>
          <button className="tab">Upcoming</button>
          <button className="tab">Completed</button>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Charity Marathon</h4>
            <span className="event-date">Feb 10, 2026</span>
          </div>
          <p className="event-desc">
            Organize a city-wide marathon to raise funds for local charities.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Edit</button>
            <button className="btn-secondary">View</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Blood Donation Camp</h4>
            <span className="event-date">Feb 18, 2026</span>
          </div>
          <p className="event-desc">
            Coordinate with hospitals to host a blood donation drive.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Edit</button>
            <button className="btn-secondary">View</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrganizerDashboard;
