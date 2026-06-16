import React from "react";
import NeonLineChart from "./NeonLineChart";
import NeonDonut from "./NeonDonut";
import NeonCircular from "./NeonCircular";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <>
      {/* Stats cards */}
      <div className="vd-cards">
        <div className="vd-card">
          <div className="vd-card-title">Total Users</div>
          <div className="vd-card-value">420</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Organizers</div>
          <div className="vd-card-value">36</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Total Events</div>
          <div className="vd-card-value">128</div>
        </div>

        <div className="vd-card">
          <div className="vd-card-title">Pending Approvals</div>
          <div className="vd-card-value">9</div>
        </div>
      </div>

      {/* Activity Overview */}
      <section className="vd-section">
        <h3>Admin Overview</h3>

        <div className="vd-multi-graphs">
          <div className="vd-graph-card">
            <h4>Events created over time</h4>
            <NeonLineChart points={[6, 9, 12, 18, 21, 26, 30]} />
          </div>

          <div className="vd-graph-card">
            <h4>Approval rate</h4>

            {/* CENTERED NeonCircular */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <NeonCircular value={78} label="Approved %" />
            </div>
          </div>

          <div className="vd-graph-card">
            <h4>Event status ratio</h4>
            <NeonDonut value={65} label="Approved vs Pending" />
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="vd-section">
        <h3>Recent Admin Activities</h3>

        <div className="event-tabs">
          <button className="tab active">Pending</button>
          <button className="tab">Approved</button>
          <button className="tab">Rejected</button>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Beach Cleanup Drive</h4>
            <span className="event-date">Jan 18, 2026</span>
          </div>
          <p className="event-desc">
            Event submitted by <strong>Green Earth Org</strong> awaiting approval.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Approve</button>
            <button className="btn-secondary">Reject</button>
          </div>
        </div>

        <div className="event-card">
          <div className="event-header">
            <h4>Flood Relief Camp</h4>
            <span className="event-date">Jan 22, 2026</span>
          </div>
          <p className="event-desc">
            Event submitted by <strong>Relief Foundation</strong> awaiting approval.
          </p>
          <div className="event-actions">
            <button className="btn-primary">Approve</button>
            <button className="btn-secondary">Reject</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
