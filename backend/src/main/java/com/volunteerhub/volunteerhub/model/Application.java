package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Volunteer who applied
    private Long volunteerId;

    // Event applied for
    private Long eventId;

    // PENDING / APPROVED / REJECTED
    private String status;

    public Application() {
        this.status = "PENDING";
    }

    // getters & setters
    public Long getId() { return id; }

    public Long getVolunteerId() { return volunteerId; }
    public void setVolunteerId(Long volunteerId) { this.volunteerId = volunteerId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
