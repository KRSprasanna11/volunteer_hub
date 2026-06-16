import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

/* ================= SKILL CATEGORIES ================= */
const SKILL_CATEGORIES = {
  "General Volunteering": [
    "Cleaning",
    "Cooking",
    "Food Distribution",
    "Clothing Distribution",
    "Event Volunteering",
    "Crowd Management",
  ],
  Education: [
    "Teaching",
    "Tutoring",
    "Mentoring",
    "Child Care",
    "Adult Education",
    "Special Education Support",
  ],
  "Health & Safety": [
    "First Aid",
    "CPR",
    "Medical Assistance",
    "Elder Care",
    "Disability Support",
    "Mental Health Support",
  ],
  Environment: [
    "Gardening",
    "Tree Plantation",
    "Waste Management",
    "Recycling",
    "Environmental Awareness",
    "Water Conservation",
  ],
  "Animal Care": [
    "Animal Care",
    "Pet Handling",
    "Animal Rescue",
    "Shelter Assistance",
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
    "Content Writing",
  ],
  "Management & Social": [
    "Event Management",
    "Project Coordination",
    "Team Leadership",
    "Volunteer Coordination",
    "Documentation",
    "Public Speaking",
    "Fundraising",
    "Community Outreach",
  ],
  Creative: ["Art & Craft", "Painting", "Music", "Dance", "Drama"],
};

const VolunteerProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= BASIC PROFILE ================= */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  /* ================= EXTRA PROFILE ================= */
  const [extraProfile, setExtraProfile] = useState({
    occupation: "",
    address: "",
    city: "",
    state: "",
    gender: "",
    age: "",
    availability: "",
  });

  /* ================= SKILLS ================= */
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkills, setShowSkills] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [skillSearch, setSkillSearch] = useState("");

  /* ================= LOAD BASIC PROFILE ================= */
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/users/volunteer/${user.id}`)
      .then((res) => {
        const data = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        };
        setProfile(data);
        setOriginalProfile(data);
      })
      .catch(() => alert("Failed to load profile"));
  }, [user?.id]);

  /* ================= LOAD EXTRA PROFILE + SKILLS ================= */
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/volunteer/profile/${user.id}`)
      .then((res) => {
        setExtraProfile({
          occupation: res.data.occupation || "",
          address: res.data.address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          gender: res.data.gender || "",
          age: res.data.age || "",
          availability: res.data.availability || "",
        });

        // ✅ FIX: Backend already returns List<String>
        setSelectedSkills(res.data.skills || []);
      })
      .catch(() => console.log("No extra profile found"));
  }, [user?.id]);

  /* ================= HANDLERS ================= */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraProfile((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE BASIC PROFILE ================= */
  const saveProfile = () => {
    axios
      .put(`http://localhost:8080/api/users/volunteer/${user.id}`, {
        name: profile.name,
        phone: profile.phone,
      })
      .then(() => {
        alert("Profile updated successfully");
        setOriginalProfile(profile);
        setIsEditing(false);
      })
      .catch(() => alert("Update failed"));
  };

  const cancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  /* ================= UPDATE FULL PROFILE (FINAL FIXED) ================= */
  const updateVolunteerProfile = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/volunteer/profile/${user.id}`,
        {
          ...extraProfile,

          // ✅ Age must be Integer
          age: extraProfile.age ? parseInt(extraProfile.age) : null,

          // ✅ Skills must be List<String>
          skills: selectedSkills,
        }
      );

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update Error:", err.response?.data || err);
      alert("Profile update failed");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {/* ================= BASIC PROFILE ================= */}
      <div className="profile-card">
        <div className="profile-group">
          <label>Name</label>
          <input
            className="profile-input"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-group">
          <label>Email</label>
          <input className="profile-input" value={profile.email} disabled />
        </div>

        <div className="profile-group">
          <label>Phone</label>
          <input
            className="profile-input"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            disabled={!isEditing}
          />
        </div>

        {!isEditing ? (
          <button
            className="profile-save-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button className="profile-save-btn" onClick={saveProfile}>
              Save Changes
            </button>
            <button className="profile-save-btn cancel" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>

      {/* ================= ADDITIONAL DETAILS ================= */}
      <h2 className="profile-title">Additional Details</h2>

      <div className="profile-card">
        {[
          "occupation",
          "address",
          "city",
          "state",
          "gender",
          "age",
          "availability",
        ].map((field) => (
          <div className="profile-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              className="profile-input"
              name={field}
              value={extraProfile[field]}
              onChange={handleExtraChange}
            />
          </div>
        ))}

        {/* ================= SKILLS ACCORDION ================= */}
        <div style={{ marginTop: "20px" }}>
          <div
            onClick={() => setShowSkills(!showSkills)}
            style={{
              cursor: "pointer",
              fontWeight: 800,
              color: "#00ffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>Skills</span>
            <span style={{ fontSize: "20px" }}>{showSkills ? "−" : "+"}</span>
          </div>

          {showSkills && (
            <>
              <input
                className="profile-input"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                style={{ marginBottom: "16px" }}
              />

              {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => {
                const filtered = skills.filter((s) =>
                  s.toLowerCase().includes(skillSearch.toLowerCase())
                );

                if (!filtered.length) return null;

                return (
                  <div key={category} style={{ marginBottom: "14px" }}>
                    <div
                      onClick={() =>
                        setOpenCategory(
                          openCategory === category ? null : category
                        )
                      }
                      style={{
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#38fdfd",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{category}</span>
                      <span>{openCategory === category ? "−" : "+"}</span>
                    </div>

                    {openCategory === category && (
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {filtered.map((skill) => {
                          const selected = selectedSkills.includes(skill);

                          return (
                            <span
                              key={skill}
                              onClick={() =>
                                setSelectedSkills((prev) =>
                                  selected
                                    ? prev.filter((s) => s !== skill)
                                    : [...prev, skill]
                                )
                              }
                              style={{
                                padding: "6px 14px",
                                borderRadius: "999px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "700",
                                background: selected
                                  ? "linear-gradient(135deg,#22d3ee,#8b5cf6)"
                                  : "rgba(255,255,255,0.1)",
                                color: selected ? "#000" : "#fff",
                              }}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ================= UPDATE BUTTON ================= */}
      <button
        className="profile-save-btn"
        style={{ marginTop: "24px" }}
        onClick={updateVolunteerProfile}
      >
        Update Profile
      </button>
    </div>
  );
};

export default VolunteerProfile;
