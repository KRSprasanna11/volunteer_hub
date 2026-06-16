package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_verification")
public class DocumentVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    // VOLUNTEER or ORGANIZER
    private String role;

    // stored file path or URL
    private String documentUrl;

    // PENDING, APPROVED, REJECTED
    private String status;

    private LocalDateTime uploadedAt;

    private LocalDateTime verifiedAt;

    // ==============================
    // NEW: Link to User (for name)
    // ==============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    private User user;

    public DocumentVerification() {
    }

    public DocumentVerification(Long userId, String role, String documentUrl, String status) {
        this.userId = userId;
        this.role = role;
        this.documentUrl = documentUrl;
        this.status = status;
        this.uploadedAt = LocalDateTime.now();
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    // ==============================
    // NEW: User getter
    // ==============================
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
