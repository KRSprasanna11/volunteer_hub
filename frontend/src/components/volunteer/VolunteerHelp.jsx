import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VolunteerHelp.css";

const VolunteerHelp = () => {
  const [form, setForm] = useState({
    subject: "",
    message: ""
  });

  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Load tickets from backend
  const fetchTickets = () => {
    if (!user) return;

    axios
      .get(
        `http://localhost:8080/api/support/user?userId=${user.id}&userRole=VOLUNTEER`
      )
      .then((res) => setTickets(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) return;

    axios
      .post("http://localhost:8080/api/support/create", {
        userId: user.id,
        userRole: "VOLUNTEER",
        subject: form.subject,
        message: form.message
      })
      .then(() => {
        alert("Support request submitted!");
        setForm({ subject: "", message: "" });
        fetchTickets(); // refresh ticket list
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit request");
      });
  };

  return (
    <div className="help-container">
      <h1 className="help-title">Help & Support</h1>
      <p className="help-subtitle">
        Get help with events, attendance, and certificates.
      </p>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate("/volunteer/available-events")}>
          Available Events
        </button>
        <button onClick={() => navigate("/volunteer/my-events")}>
          My Events
        </button>
        <button onClick={() => navigate("/volunteer/history")}>
          Event History
        </button>
        <button onClick={() => navigate("/volunteer/certificates")}>
          Certificates
        </button>
      </div>

      {/* FAQ Section */}
      <div className="help-card">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq-list">
          <li>How do I apply for an event?</li>
          <li>Where can I see my event history?</li>
          <li>How do I download my certificate?</li>
          <li>Why is my attendance not marked?</li>
          <li>How do I update my profile?</li>
        </ul>
      </div>

      {/* Contact Form */}
      <div className="help-card">
        <h2>Contact Support</h2>
        <form onSubmit={handleSubmit} className="support-form">
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Issue</option>
            <option value="Event issue">Event issue</option>
            <option value="Attendance issue">Attendance issue</option>
            <option value="Certificate issue">Certificate issue</option>
            <option value="Profile issue">Profile issue</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            placeholder="Describe your issue..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>

      {/* Ticket History */}
      <div className="help-card">
        <h2>My Support Tickets</h2>
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.subject}</td>
                <td className={`status ${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </td>
                <td>
                  {ticket.createdAt
                    ? ticket.createdAt.split("T")[0]
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Support Info */}
      <div className="help-card">
        <h2>Support Contact</h2>
        <p>Email: support@volunteerhub.com</p>
        <p>Hours: Mon–Fri, 9 AM – 6 PM</p>
      </div>
    </div>
  );
};

export default VolunteerHelp;
