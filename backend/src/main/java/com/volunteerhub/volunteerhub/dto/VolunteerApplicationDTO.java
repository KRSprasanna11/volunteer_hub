package com.volunteerhub.volunteerhub.dto;

import com.volunteerhub.volunteerhub.model.AttendanceStatus;

public class VolunteerApplicationDTO {

    private Long id;
    private Long eventId;
    private Long volunteerId;

    // ✅ Display Fields
    private String volunteerName;
    private String volunteerEmail;
    private String eventTitle;

    // ✅ NEW FIELD ADDED
    private String eventDate;

    // ✅ Attendance Field
    private AttendanceStatus attendanceStatus;

    // ✅ Application Status (APPROVED / PENDING / etc.)
    private String status;

    // ==================================================
    // ✅ MULTI-DAY ATTENDANCE FIELDS (ADDED)
    // ==================================================
    private Integer attendedDays;
    private Integer totalDays;
    private Boolean attendanceCompleted;

    // ✅ Empty Constructor (Required)
    public VolunteerApplicationDTO() {
    }

    // ---------------- GETTERS & SETTERS ----------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerEmail() {
        return volunteerEmail;
    }

    public void setVolunteerEmail(String volunteerEmail) {
        this.volunteerEmail = volunteerEmail;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    // ==================================================
    // ✅ Event Date Getter & Setter Added
    // ==================================================

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
