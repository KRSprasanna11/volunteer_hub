import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerProfileModal.css";

/* ================= SKILL CATEGORIES ================= */
const SKILL_CATEGORIES = {
  "General Volunteering": [
    "Cleaning",
    "Cooking",
    "Food Distribution",
    "Clothing Distribution",
    "Event Volunteering",
    "Crowd Management"
  ],
  Education: [
    "Teaching",
    "Tutoring",
    "Mentoring",
    "Child Care",
    "Adult Education",
    "Special Education Support"
  ],
  "Health & Safety": [
    "First Aid",
    "CPR",
    "Medical Assistance",
    "Elder Care",
    "Disability Support",
    "Mental Health Support"
  ],
  Environment: [
    "Gardening",
    "Tree Plantation",
    "Waste Management",
    "Recycling",
    "Environmental Awareness",
    "Water Conservation"
  ],
  "Animal Care": [
    "Animal Care",
    "Pet Handling",
    "Animal Rescue",
    "Shelter Assistance"
  ],
  "Technical / Professional": [
    "Computer Basics",
    "Technical Support",
    "IT Support",
    "Data Entry",
    "Web Development",
    "Graphic Design",
    "Video Editing",
    "Photography",
    "Social Media Management",
    "Content Writing"
  ],
  "Management & Social": [
    "Event Management",
    "Project Coordination",
    "Team Leadership",
    "Volunteer Coordination",
    "Documentation",
    "Public Speaking",
    "Fundraising",
    "Community Outreach"
  ],
  Creative: ["Art & Craft", "Painting", "Music", "Dance", "Drama"]
};

const VolunteerProfileModal = ({ volunteerId, onClose }) => {
  const [basic, setBasic] = useState(null);
  const [extra, setExtra] = useState({});
  const [skills, setSkills] = useState([]);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!volunteerId) return;

    // 🔹 BASIC PROFILE
    axios
      .get(`http://localhost:8080/api/users/volunteer/${volunteerId}`)
      .then((res) => setBasic(res.data))
      .catch(() => console.error("Failed to load basic profile"));

    // 🔹 EXTRA PROFILE + SKILLS
    axios
      .get(`http://localhost:8080/api/volunteer/profile/${volunteerId}`)
      .then((res) => {
        setExtra(res.data || {});
        setSkills(res.data?.skills || []);
      })
      .catch(() => setSkills([]));
  }, [volunteerId]);

  if (!basic) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Volunteer Profile</h2>

        {/* ================= BASIC DETAILS ================= */}
        <div className="section">
          <h4>Basic Information</h4>
          <p><b>Name:</b> {basic.name}</p>
          <p><b>Email:</b> {basic.email}</p>
          <p><b>Phone:</b> {basic.phone}</p>
        </div>

        {/* ================= ADDITIONAL DETAILS ================= */}
        <div className="section">
          <h4>Additional Details</h4>
          <p><b>Occupation:</b> {extra.occupation || "-"}</p>
          <p><b>Address:</b> {extra.address || "-"}</p>
          <p><b>City:</b> {extra.city || "-"}</p>
          <p><b>State:</b> {extra.state || "-"}</p>
          <p><b>Gender:</b> {extra.gender || "-"}</p>
          <p><b>Age:</b> {extra.age || "-"}</p>
          <p><b>Availability:</b> {extra.availability || "-"}</p>
        </div>

        {/* ================= SKILLS ================= */}
        <div className="section">
          <h4>Skills</h4>

          {Object.entries(SKILL_CATEGORIES).map(([category, list]) => {
            const matched = list.filter((skill) =>
              skills.includes(skill)
            );

            if (!matched.length) return null;

            return (
              <div key={category} className="skill-group">
                <h5>{category}</h5>
                <div className="skill-tags">
                  {matched.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {skills.length === 0 && (
            <p style={{ opacity: 0.6 }}>No skills added</p>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default VolunteerProfileModal;
