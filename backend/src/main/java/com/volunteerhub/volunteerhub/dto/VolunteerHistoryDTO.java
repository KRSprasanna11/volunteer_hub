package com.volunteerhub.volunteerhub.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class VolunteerHistoryDTO {

    private Long id;
    private String eventName;
    private String organizerName;
    private String status;
    private LocalDateTime updatedAt;

    // ✅ NEW: Event Date & Time Fields
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // ✅ UPDATED CONSTRUCTOR (Matches HistoryService)
    public VolunteerHistoryDTO(
            Long id,
            String eventName,
            String organizerName,
            String status,
            LocalDateTime updatedAt,
            LocalDate startDate,
            LocalTime startTime,
            LocalTime endTime
    ) {
        this.id = id;
        this.eventName = eventName;
        this.organizerName = organizerName;
        this.status = status;
        this.updatedAt = updatedAt;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // ✅ GETTERS

    public Long getId() {
        return id;
    }

    public String getEventName() {
        return eventName;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ✅ NEW GETTERS FOR UI

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}
