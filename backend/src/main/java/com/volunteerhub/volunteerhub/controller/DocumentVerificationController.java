package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.DocumentVerification;
import com.volunteerhub.volunteerhub.service.DocumentVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentVerificationController {

    @Autowired
    private DocumentVerificationService service;

    // ==============================
    // Volunteer / Organizer
    // ==============================

    // Upload document (URL or File)
    @PostMapping("/upload")
    public DocumentVerification uploadDocument(
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam(required = false) String documentUrl,
            @RequestParam(required = false) MultipartFile file
    ) {
        try {
            String finalDocumentUrl = documentUrl;

            // If file is uploaded
            if (file != null && !file.isEmpty()) {

                // Use absolute path
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
                File dir = new File(uploadDir);

                if (!dir.exists()) {
                    dir.mkdirs();
                }

                // Generate unique file name
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

                // Save file
                File destination = new File(dir, fileName);
                file.transferTo(destination);

                // Save file path as document URL
                finalDocumentUrl = "/uploads/" + fileName;
            }

            return service.uploadDocument(userId, role, finalDocumentUrl);

        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    // Get document status
    @GetMapping("/status")
    public Optional<DocumentVerification> getStatus(
            @RequestParam Long userId,
            @RequestParam String role
    ) {
        return service.getUserDocument(userId, role);
    }

    // ==============================
    // Admin
    // ==============================

    // Get all documents
    @GetMapping("/admin/all")
    public List<DocumentVerification> getAllDocuments() {
        return service.getAllDocuments();
    }

    // Get only pending documents
    @GetMapping("/admin/pending")
    public List<DocumentVerification> getPendingDocuments() {
        return service.getPendingDocuments();
    }

    // Approve document
    @PutMapping("/admin/{id}/approve")
    public DocumentVerification approve(@PathVariable Long id) {
        return service.approveDocument(id);
    }

    // Reject document
    @PutMapping("/admin/{id}/reject")
    public DocumentVerification reject(@PathVariable Long id) {
        return service.rejectDocument(id);
    }
}
