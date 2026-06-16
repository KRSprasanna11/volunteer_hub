package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.model.Certificate;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.CertificateRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;

    // ✅ PDF Service (Needed for Download + Email)
    private final CertificatePdfService pdfService;

    // ✅ Email Service (NEW REQUIRED)
    private final EmailService emailService;

    public CertificateService(
            CertificateRepository certificateRepo,
            EventRepository eventRepo,
            UserRepository userRepo,
            CertificatePdfService pdfService,
            EmailService emailService   // ✅ Injected
    ) {
        this.certificateRepo = certificateRepo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    // ==================================================
    // ✅ GENERATE CERTIFICATE (Organizer Side)
    // ==================================================
    public Certificate generateCertificate(Long volunteerId, Long eventId) {

        // ✅ Prevent Duplicate Certificate
        certificateRepo.findByVolunteerIdAndEventId(volunteerId, eventId)
                .ifPresent(cert -> {
                    throw new RuntimeException("Certificate already generated!");
                });

        // ✅ Fetch Event
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ Fetch Organizer
        User organizer = userRepo.findById(event.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        // ✅ Fetch Volunteer
        User volunteer = userRepo.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        // ✅ Create Certificate Object
        Certificate cert = new Certificate();
        cert.setVolunteerId(volunteerId);
        cert.setEventId(eventId);

        cert.setVolunteerName(volunteer.getName());
        cert.setEventTitle(event.getTitle());
        cert.setOrganizerName(organizer.getName());

        cert.setIssueDate(LocalDate.now());

        // ==================================================
        // ✅ AUTO GENERATE REFERENCE NUMBER (NEW FIX)
        // Example: VH-CERT-9-8-1700000000000
        // ==================================================
        String reference =
                "VH-CERT-" + eventId + "-" + volunteerId + "-" + System.currentTimeMillis();

        cert.setReferenceNumber(reference);

        // ✅ Save Certificate
        Certificate savedCert = certificateRepo.save(cert);

        // ==================================================
        // ✅ SEND CERTIFICATE TO VOLUNTEER MAIL WITH PDF ATTACHMENT
        // ==================================================
        try {
            // ✅ Generate PDF Bytes
            byte[] pdfBytes = pdfService.generatePdf(savedCert);

            // ✅ Send Email with Attachment
            emailService.sendCertificateWithAttachment(
                    volunteer.getEmail(),
                    "🏅 Your Certificate is Ready - VolunteerHub",
                    "Hi " + volunteer.getName() + ",\n\n" +
                            "Congratulations!\n\n" +
                            "Your certificate for the event \"" + event.getTitle() + "\" is ready.\n\n" +
                            "📌 Organizer: " + organizer.getName() + "\n" +
                            "📅 Issue Date: " + LocalDate.now() + "\n\n" +
                            "Your certificate is attached with this email.\n\n" +
                            "- VolunteerHub Team",
                    pdfBytes,
                    "certificate_" + savedCert.getId() + ".pdf"
            );

            System.out.println("✅ Certificate Sent to Volunteer Email!");

        } catch (Exception e) {
            System.out.println("❌ Certificate Email Failed: " + e.getMessage());
        }

        return savedCert;
    }

    // ==================================================
    // ✅ VOLUNTEER VIEW CERTIFICATES
    // ==================================================
    public List<Certificate> getCertificatesForVolunteer(Long volunteerId) {
        return certificateRepo.findByVolunteerId(volunteerId);
    }

    // ==================================================
    // ✅ DOWNLOAD CERTIFICATE PDF
    // ==================================================
    public ResponseEntity<byte[]> downloadCertificatePdf(Long id) {

        // ✅ Fetch Certificate
        Certificate cert = certificateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        // ✅ Generate PDF Bytes
        byte[] pdfBytes = pdfService.generatePdf(cert);

        // ✅ Return PDF as Download Response
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate_" + cert.getId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
