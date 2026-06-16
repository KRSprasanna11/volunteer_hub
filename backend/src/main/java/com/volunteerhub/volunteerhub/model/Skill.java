package com.volunteerhub.volunteerhub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // ✅ RELATIONSHIP WITH VOLUNTEER PROFILE
    @JsonIgnore  // ✅ FIX: Prevent infinite recursion + LazyInitialization error
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_profile_id")
    private VolunteerProfile volunteerProfile;

    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public VolunteerProfile getVolunteerProfile() {
        return volunteerProfile;
    }

    // ===== SETTERS =====
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    // 🔥 REQUIRED SETTER
    public void setVolunteerProfile(VolunteerProfile volunteerProfile) {
        this.volunteerProfile = volunteerProfile;
    }
}
