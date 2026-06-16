package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "event_applications",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"event_id", "volunteer_id"}
        )
)
public class EventApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== CORE IDS (DO NOT CHANGE) =====
    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "volunteer_id", nullable = false)
    private Long volunteerId;

    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    // ✅ Relationship (No DB Change)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private Event event;

    // ===== EXTRA DISPLAY FIELDS =====
    private String eventName;
    private String organizerName;

    // ===== STATUS & TIMESTAMPS =====
    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ===== Attendance Status (Single-day support) =====
    @Column(name = "attendance_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendanceStatus = AttendanceStatus.NOT_MARKED;

    // ==================================================
    // ✅ MULTI-DAY ATTENDANCE SUPPORT (SAFE ADDITIONS)
    // ==================================================

    // Number of days volunteer attended
    @Column(name = "attended_days")
    private Integer attendedDays = 0;

    // Total event days snapshot
    @Column(name = "total_days")
    private Integer totalDays = 1;

    // Whether attendance for all days is completed
    @Column(name = "attendance_completed")
    private Boolean attendanceCompleted = false;

    // -------- GETTERS & SETTERS --------

    public Long getId() {
        return id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    // ✅ Event Getter + Setter (FIX)
    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ✅ Optional Setter (Safe)
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    // ==================================================
    // ✅ MULTI-DAY ATTENDANCE GETTERS & SETTERS
    // ==================================================

    public Integer getAttendedDays() {
        return attendedDays;
    }

    public void setAttendedDays(Integer attendedDays) {
        this.attendedDays = attendedDays;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public Boolean getAttendanceCompleted() {
        return attendanceCompleted;
    }

    public void setAttendanceCompleted(Boolean attendanceCompleted) {
        this.attendanceCompleted = attendanceCompleted;
    }
}
