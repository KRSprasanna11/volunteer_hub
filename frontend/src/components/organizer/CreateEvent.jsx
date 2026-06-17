import React, { useState } from "react";
import axios from "axios";
import "./createevent.css";

const CreateEvent = () => {
  // ✅ STEP 1: EXTENDED formData
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",

    // 🆕 Registration Period
    registrationStartDate: "",
    registrationStartTime: "",
    registrationEndDate: "",
    registrationEndTime: "",

    locationName: "",
    address: "",
    city: "",
    area: "",
    mapLink: "",
    volunteers: "",
    skills: "",
    minAge: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "ORGANIZER") {
      alert("Unauthorized");
      return;
    }

    // ✅ STEP 3: UPDATED PAYLOAD
    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,

      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,

      // 🆕 Registration window
      registrationStartDate: formData.registrationStartDate,
      registrationStartTime: formData.registrationStartTime,
      registrationEndDate: formData.registrationEndDate,
      registrationEndTime: formData.registrationEndTime,

      locationName: formData.locationName,
      address: formData.address,
      city: formData.city,
      area: formData.area,
      mapLink: formData.mapLink,

      totalSlots: formData.volunteers,
      skills: formData.skills,
      minAge: formData.minAge,
      genderPref: formData.gender,
      createdBy: user.id,
    };

    try {
      await axios.post(
        "http://https://volunteer-hub-jp64.onrender.com/api/events",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Event Created Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="create-event-container">
      <h2 className="form-title">ADD EVENT</h2>

      <form onSubmit={handleSubmit} className="create-event-form">
        {/* 1. Basic Event Information */}
        <section>
          <h3>Basic Event Information</h3>

          <label>Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="Community Cleanup Drive"
            onChange={handleChange}
          />

          <label>Event Category</label>
          <select name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Cleanup">Cleanup</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Awareness Program">Awareness Program</option>
          </select>

          <label>Event Description</label>
          <textarea
            name="description"
            placeholder="Purpose, activities, instructions"
            onChange={handleChange}
          />
        </section>

        {/* 2. Date & Time Details */}
        <section>
          <h3>Date & Time Details</h3>

          <label>Event Start Date</label>
          <input type="date" name="startDate" onChange={handleChange} />

          <label>Event End Date</label>
          <input type="date" name="endDate" onChange={handleChange} />

          <label>Start Time</label>
          <input type="time" name="startTime" onChange={handleChange} />

          <label>End Time</label>
          <input type="time" name="endTime" onChange={handleChange} />
        </section>

        {/* 🆕 2.5 Registration Period */}
        <section>
          <h3>Registration Period</h3>

          <label>Registration Start Date</label>
          <input
            type="date"
            name="registrationStartDate"
            onChange={handleChange}
          />

          <label>Registration Start Time</label>
          <input
            type="time"
            name="registrationStartTime"
            onChange={handleChange}
          />

          <label>Registration End Date</label>
          <input
            type="date"
            name="registrationEndDate"
            onChange={handleChange}
          />

          <label>Registration End Time</label>
          <input
            type="time"
            name="registrationEndTime"
            onChange={handleChange}
          />
        </section>

        {/* 3. Location Details */}
        <section>
          <h3>Location Details</h3>

          <label>Event Location Name</label>
          <input type="text" name="locationName" onChange={handleChange} />

          <label>Address</label>
          <input type="text" name="address" onChange={handleChange} />

          <label>City</label>
          <input type="text" name="city" onChange={handleChange} />

          <label>Area / Zone</label>
          <input type="text" name="area" onChange={handleChange} />

          <label>Map Link / Coordinates (optional)</label>
          <input type="text" name="mapLink" onChange={handleChange} />
        </section>

        {/* 4. Volunteer Requirements */}
        <section>
          <h3>Volunteer Requirements</h3>

          <label>Required Number of Volunteers</label>
          <input type="number" name="volunteers" onChange={handleChange} />

          <label>Skills Required (optional)</label>
          <input type="text" name="skills" onChange={handleChange} />

          <label>Minimum Age (optional)</label>
          <input type="number" name="minAge" onChange={handleChange} />

          <label>Gender Preference (optional)</label>
          <select name="gender" onChange={handleChange}>
            <option value="">No Preference</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </section>

        <button type="submit" className="submit-btn">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
