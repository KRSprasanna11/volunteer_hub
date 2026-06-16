package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔔 Message content
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    // 👤 Recipient (Organizer / User)
    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    // ⏰ Created time
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔴 Read status (FINAL FIX)
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    // ---- constructors ----
    public Notification() {}

    // ---- getters ----
    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isRead() {
        return isRead;
    }

    // ---- setters ----
    public void setMessage(String message) {
        this.message = message;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setRead(boolean read) {
        this.isRead = read;
    }
}
