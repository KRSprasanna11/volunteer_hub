import React from "react";
import NeonLineChart from "./NeonLineChart";
import NeonDonut from "./NeonDonut";
import NeonCircular from "./NeonCircular";
import "./volunteerdashboard.css";

const VolunteerDashboard = () => {
  return (
    <>
      {/* Stats cards */}
      <div className="vd-cards">
        <div className="vd-card">
          <div className="vd-card-title">Upcoming Events</div>
          <div className="vd-card-value">6</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Completed</div>
          <div className="vd-card-value">18</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Hours Served</div>
          <div className="vd-card-value">124</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Messages</div>
          <div className="vd-card-value">3</div>
        </div>
      </div>

      {/* Activity Overview */}
      <section className="vd-section">
        <h3>Activity Overview</h3>

        <div className="vd-multi-graphs">
          <div className="vd-graph-card">
            <h4>Events over time</h4>
            <NeonLineChart points={[8, 14, 11, 18, 16, 22, 20]} />
          </div>

          <div className="vd-graph-card">
            <h4>Hours served</h4>

            {/* ✅ CENTERED NeonCircular */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <NeonCircular value={72} label="Goal 100 hrs" />
            </div>
          </div>

          <div className="vd-graph-card">
            <h4>Attendance ratio</h4>
            <NeonDonut value={64} label="Avg attendance" />
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="vd-section">
        <h3>Events</h3>

        <div className="event-tabs">
          <button className="tab active">All Events</button>
          <button className="tab">Joined</button>
          <button className="tab">Completed</button>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Community Clean-up</h4>
            <span className="event-date">Jan 20, 2026</span>
          </div>
          <p className="event-desc">
            Join us to clean the riverside area—tools and refreshments provided.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Join</button>
            <button className="btn-secondary">View</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Food Drive</h4>
            <span className="event-date">Jan 28, 2026</span>
          </div>
          <p className="event-desc">
            Help pack and distribute food kits to local families in need.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Join</button>
            <button className="btn-secondary">View</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default VolunteerDashboard;
