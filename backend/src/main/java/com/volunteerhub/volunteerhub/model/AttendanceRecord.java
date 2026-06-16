package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance_records")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Link with Application
    @Column(nullable = false)
    private Long applicationId;

    // ==================================================
    // ✅ ADD THIS (Event Link for Organizer Reports)
    // ==================================================
    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    // ✅ Attendance Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status = AttendanceStatus.NOT_MARKED;

    // ✅ Empty Constructor
    public AttendanceRecord() {
    }

    // =============================
    // ✅ GETTERS & SETTERS
    // =============================

    public Long getId() {
        return id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    // ✅ Getter + Setter for EventId (Required)
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
}
