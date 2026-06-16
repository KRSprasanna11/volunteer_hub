package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String userRole; // VOLUNTEER or ORGANIZER

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status; // PENDING, IN_PROGRESS, RESOLVED

    private LocalDateTime createdAt;

    public SupportTicket() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public SupportTicket(Long userId, String userRole, String subject, String message) {
        this.userId = userId;
        this.userRole = userRole;
        this.subject = subject;
        this.message = message;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
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
}
