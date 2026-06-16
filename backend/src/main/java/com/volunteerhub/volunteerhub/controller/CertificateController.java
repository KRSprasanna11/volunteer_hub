package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.Certificate;
import com.volunteerhub.volunteerhub.service.CertificateService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:3000")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // ==================================================
    // ✅ Organizer Generates Certificate
    // URL: /api/certificates/generate?volunteerId=1&eventId=2
    // ==================================================
    @GetMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(
            @RequestParam Long volunteerId,
            @RequestParam Long eventId
    ) {
        Certificate cert =
                certificateService.generateCertificate(volunteerId, eventId);

        return ResponseEntity.ok(cert);
    }

    // ==================================================
    // ✅ Volunteer View Certificates
    // URL: /api/certificates/volunteer/5
    // ==================================================
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Certificate>> getCertificatesForVolunteer(
            @PathVariable Long volunteerId
    ) {
        List<Certificate> certificates =
                certificateService.getCertificatesForVolunteer(volunteerId);

        return ResponseEntity.ok(certificates);
    }

    // ==================================================
    // ✅ Download Certificate PDF
    // URL: /api/certificates/download/{id}
    // ==================================================
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long id
    ) {
        return certificateService.downloadCertificatePdf(id);
    }
}
