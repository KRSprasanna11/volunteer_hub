import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditEvent.css";

const EditEvent = () => {
  const { id } = useParams(); // ✅ Event ID from URL
  const navigate = useNavigate();

  // ✅ Event Form State
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    locationName: "",
    city: "",
    address: "",
    totalSlots: 0,
  });

  // ✅ Load Event Details
  useEffect(() => {
    axios
      .get(`https://volunteer-hub-jp64.onrender.com/api/events`)
      .then((res) => {
        const found = res.data.find((ev) => ev.id === Number(id));

        if (found) {
          setEventData(found);
        }
      })
      .catch((err) => console.log("Error loading event:", err));
  }, [id]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Update Event API Call
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`https://volunteer-hub-jp64.onrender.com/api/events/${id}`, eventData)
      .then(() => {
        alert("Event Updated Successfully!");
        navigate("/organizer/my-events"); // ✅ Back to My Events
      })
      .catch((err) => {
        console.log("Update Error:", err);
        alert("Failed to update event");
      });
  };

  return (
    <div className="edit-event-page">
      <h2 className="edit-title">✏️ Edit Event</h2>

      <form className="edit-form" onSubmit={handleUpdate}>
        {/* Title */}
        <label>Event Title</label>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={eventData.category}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          rows="3"
        />

        {/* Dates */}
        <div className="row">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Time */}
        <div className="row">
          <div>
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <label>Location Name</label>
        <input
          type="text"
          name="locationName"
          value={eventData.locationName}
          onChange={handleChange}
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={eventData.city}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={eventData.address}
          onChange={handleChange}
        />

        {/* Slots */}
        <label>Total Slots</label>
        <input
          type="number"
          name="totalSlots"
          value={eventData.totalSlots}
          onChange={handleChange}
        />

        {/* Buttons */}
        <div className="btn-group">
          <button type="submit" className="save-btn">
            Save Changes
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/organizer/my-events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
