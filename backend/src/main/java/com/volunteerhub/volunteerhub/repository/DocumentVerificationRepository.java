package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.DocumentVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentVerificationRepository
        extends JpaRepository<DocumentVerification, Long> {

    // Get document by userId and role
    Optional<DocumentVerification> findByUserIdAndRole(Long userId, String role);

    // Get all documents by status (for admin panel)
    List<DocumentVerification> findByStatus(String status);

    // Get all documents
    List<DocumentVerification> findAll();
}
