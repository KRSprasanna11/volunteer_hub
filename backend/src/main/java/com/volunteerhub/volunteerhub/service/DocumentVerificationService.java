package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.model.DocumentVerification;
import com.volunteerhub.volunteerhub.repository.DocumentVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentVerificationService {

    @Autowired
    private DocumentVerificationRepository repository;

    // Upload or update document
    public DocumentVerification uploadDocument(Long userId, String role, String documentUrl) {

        // ✅ Safety check
        if (userId == null || role == null || documentUrl == null || documentUrl.isEmpty()) {
            throw new RuntimeException("Invalid document upload data");
        }

        Optional<DocumentVerification> existing =
                repository.findByUserIdAndRole(userId, role);

        DocumentVerification doc;

        if (existing.isPresent()) {
            // Update existing document
            doc = existing.get();
            doc.setDocumentUrl(documentUrl);
            doc.setStatus("PENDING");
            doc.setUploadedAt(LocalDateTime.now());
            doc.setVerifiedAt(null);
        } else {
            // New document
            doc = new DocumentVerification(
                    userId,
                    role,
                    documentUrl,
                    "PENDING"
            );
        }

        return repository.save(doc);
    }

    // Get user document status
    public Optional<DocumentVerification> getUserDocument(Long userId, String role) {
        return repository.findByUserIdAndRole(userId, role);
    }

    // Admin: get all documents
    public List<DocumentVerification> getAllDocuments() {
        return repository.findAll();
    }

    // Admin: get pending documents
    public List<DocumentVerification> getPendingDocuments() {
        return repository.findByStatus("PENDING");
    }

    // Admin: approve
    public DocumentVerification approveDocument(Long id) {
        DocumentVerification doc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        doc.setStatus("APPROVED");
        doc.setVerifiedAt(LocalDateTime.now());

        return repository.save(doc);
    }

    // Admin: reject
    public DocumentVerification rejectDocument(Long id) {
        DocumentVerification doc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        doc.setStatus("REJECTED");
        doc.setVerifiedAt(LocalDateTime.now());

        return repository.save(doc);
    }
}
