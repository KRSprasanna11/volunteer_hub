package com.volunteerhub.volunteerhub.dto;

import java.time.LocalDateTime;

public class SupportTicketDTO {

    private Long id;
    private Long userId;
    private String userRole; // VOLUNTEER or ORGANIZER
    private String subject;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    public SupportTicketDTO() {
    }

    public SupportTicketDTO(Long id, Long userId, String userRole,
                            String subject, String message,
                            String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.subject = subject;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
