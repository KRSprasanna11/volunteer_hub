import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminComplaints.css";

const AdminComplaints = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/support/all");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resolveTicket = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/support/${id}/resolve`);
      fetchTickets();
    } catch (err) {
      console.error("Error resolving ticket", err);
    }
  };

  return (
    <div className="admin-complaints-page">
      <h2 className="complaints-title">Support Complaints</h2>

      <div className="complaints-grid">
        {tickets.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          tickets.map((ticket) => (
            <div className="complaint-card" key={ticket.id}>
              <div className="complaint-header">
                <span className="ticket-id">#{ticket.id}</span>
                <span className="role">{ticket.userRole}</span>
              </div>

              <h4 className="subject">{ticket.subject}</h4>

              <p className="message">
                {ticket.message}
              </p>

              <div className="complaint-footer">
                <span
                  className={
                    ticket.status === "RESOLVED"
                      ? "status resolved"
                      : "status pending"
                  }
                >
                  {ticket.status}
                </span>

                {ticket.status !== "RESOLVED" && (
                  <button
                    className="resolve-btn"
                    onClick={() => resolveTicket(ticket.id)}
                  >
                    Resolve
                  </button>
                )}
              </div>

              <div className="date">
                {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
