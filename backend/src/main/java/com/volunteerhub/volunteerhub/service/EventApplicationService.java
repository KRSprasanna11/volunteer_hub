package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.VolunteerApplicationDTO;
import com.volunteerhub.volunteerhub.dto.VolunteerMyEventDTO;

import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.Notification;
import com.volunteerhub.volunteerhub.model.AttendanceStatus;
import com.volunteerhub.volunteerhub.model.User;

import com.volunteerhub.volunteerhub.model.AttendanceRecord;
import com.volunteerhub.volunteerhub.repository.AttendanceRecordRepository;

import com.volunteerhub.volunteerhub.repository.EventApplicationRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.NotificationRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventApplicationService {

    private final EventApplicationRepository applicationRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final NotificationRepository notificationRepo;
    private final AttendanceRecordRepository attendanceRepo;
    private final EmailService emailService;

    public EventApplicationService(
            EventApplicationRepository applicationRepo,
            EventRepository eventRepo,
            UserRepository userRepo,
            NotificationRepository notificationRepo,
            AttendanceRecordRepository attendanceRepo,
            EmailService emailService
    ) {
        this.applicationRepo = applicationRepo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.attendanceRepo = attendanceRepo;
        this.emailService = emailService;
    }

    // ================= APPLY =================
    public String apply(Long eventId, Long volunteerId) {

        if (applicationRepo
                .findByEventIdAndVolunteerId(eventId, volunteerId)
                .isPresent()) {
            return "ALREADY_APPLIED";
        }

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if ("Cancelled".equalsIgnoreCase(event.getStatus())) {
            return "EVENT_CANCELLED";
        }

        long approvedCount = applicationRepo.findByEventId(eventId)
                .stream()
                .filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus()))
                .count();

        if (approvedCount >= event.getTotalSlots()) {
            return "SLOTS_FULL";
        }

        EventApplication app = new EventApplication();
        app.setEventId(eventId);
        app.setVolunteerId(volunteerId);
        app.setOrganizerId(event.getCreatedBy());
        app.setEventName(event.getTitle());

        // snapshot values
        app.setTotalDays((int) event.getTotalDays());
        app.setAttendedDays(0);
        app.setAttendanceCompleted(false);

        User organizer = userRepo.findById(event.getCreatedBy()).orElse(null);
        if (organizer != null) {
            app.setOrganizerName(organizer.getName());
        }

        app.setStatus("PENDING");
        applicationRepo.save(app);

        // SEND EMAIL TO ORGANIZER
        User volunteer = userRepo.findById(volunteerId).orElse(null);

        if (organizer != null && volunteer != null) {
            try {
                emailService.sendEmail(
                        organizer.getEmail(),
                        "New Volunteer Applied - VolunteerHub 📩",
                        "Hi " + organizer.getName() + ",\n\n" +
                                "A volunteer has applied for your event.\n\n" +
                                "📌 Event: " + event.getTitle() + "\n" +
                                "👤 Volunteer Name: " + volunteer.getName() + "\n" +
                                "📧 Volunteer Email: " + volunteer.getEmail() + "\n\n" +
                                "Please login to Organizer Dashboard to review.\n\n" +
                                "- VolunteerHub Team"
                );
            } catch (Exception e) {
                System.out.println("❌ Organizer email failed: " + e.getMessage());
            }
        }

        return "APPLIED";
    }

    // ================= CANCEL PARTICIPATION =================
    public void cancelParticipation(Long volunteerId, Long eventId) {

        EventApplication application = applicationRepo
                .findByVolunteerIdAndEventId(volunteerId, eventId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException(
                    "Cannot cancel. Current status is: " + application.getStatus()
            );
        }

        application.setStatus("CANCELLED");
        applicationRepo.save(application);

        Notification notification = new Notification();
        notification.setRecipientId(application.getOrganizerId());
        notification.setMessage(
                "Volunteer cancelled participation for event ID: " + eventId
        );
        notification.setRead(false);

        notificationRepo.save(notification);
    }

    // ================= VOLUNTEER VIEW =================
    public List<EventApplication> getApplicationsByVolunteer(Long volunteerId) {
        return applicationRepo.findByVolunteerId(volunteerId);
    }

    public List<EventApplication> getApplicationsForVolunteer(Long volunteerId) {
        return getApplicationsByVolunteer(volunteerId);
    }

    // ================= VOLUNTEER DASHBOARD EVENTS =================
    public List<VolunteerMyEventDTO> getVolunteerEvents(Long volunteerId) {

        List<EventApplication> applications =
                applicationRepo.findByVolunteerId(volunteerId);

        return applications.stream().map(app -> {

            Event e = eventRepo.findById(app.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            VolunteerMyEventDTO dto = new VolunteerMyEventDTO();

            dto.setEventId(e.getId());
            dto.setTitle(e.getTitle());
            dto.setCategory(e.getCategory());
            dto.setDescription(e.getDescription());
            dto.setStartDate(e.getStartDate());
            dto.setEndDate(e.getEndDate());
            dto.setStartTime(e.getStartTime());
            dto.setEndTime(e.getEndTime());
            dto.setLocationName(e.getLocationName());
            dto.setAddress(e.getAddress());
            dto.setCity(e.getCity());
            dto.setArea(e.getArea());
            dto.setMapLink(e.getMapLink());
            dto.setTotalSlots(e.getTotalSlots());
            dto.setSkills(e.getSkills());
            dto.setMinAge(e.getMinAge());
            dto.setGenderPref(e.getGenderPref());
            dto.setStatus(app.getStatus());
            dto.setStatusUpdatedAt(app.getUpdatedAt());

            return dto;

        }).collect(Collectors.toList());
    }

    // ================= APPROVE / REJECT =================
    public EventApplication updateStatus(Long applicationId, String status) {

        EventApplication app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);

        User volunteer = userRepo.findById(app.getVolunteerId()).orElse(null);

        if (volunteer != null) {
            try {
                emailService.sendEmail(
                        volunteer.getEmail(),
                        "VolunteerHub Application Status Update 📢",
                        "Hi " + volunteer.getName() + ",\n\n" +
                                "Your application status has been updated.\n\n" +
                                "📌 Event: " + app.getEventName() + "\n" +
                                "✅ Status: " + status + "\n\n" +
                                "Thank you for being part of VolunteerHub!\n\n" +
                                "- VolunteerHub Team"
                );
            } catch (Exception e) {
                System.out.println("❌ Volunteer email failed: " + e.getMessage());
            }
        }

        return applicationRepo.save(app);
    }

    // ================= ORGANIZER VIEW =================
    public List<VolunteerApplicationDTO> getApplicationsForOrganizer(Long organizerId) {
        return applicationRepo.findByOrganizerId(organizerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ================= EVENT VIEW =================
    public List<VolunteerApplicationDTO> getApplicationsForEvent(Long eventId) {
        return applicationRepo.findByEventId(eventId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ================= MARK ATTENDANCE (MERGED & CORRECTED) =================
    public VolunteerApplicationDTO markAttendance(Long appId, AttendanceStatus status) {

        LocalDate today = LocalDate.now();

        EventApplication application = applicationRepo.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Event event = eventRepo.findById(application.getEventId()).orElse(null);

        if (event != null) {
            int totalDays = (int) event.getTotalDays();
            application.setTotalDays(totalDays);

            AttendanceRecord record = attendanceRepo
                    .findByApplicationIdAndAttendanceDate(appId, today)
                    .orElse(null);

            boolean isNewRecord = false;

            if (record == null) {
                record = new AttendanceRecord();
                record.setApplicationId(appId);
                record.setEventId(application.getEventId());
                record.setAttendanceDate(today);
                isNewRecord = true;
            }

            if (isNewRecord && status == AttendanceStatus.PRESENT) {
                int attended = application.getAttendedDays() == null
                        ? 0
                        : application.getAttendedDays();

                if (attended < totalDays) {
                    attended++;
                    application.setAttendedDays(attended);
                }
            }

            record.setStatus(status);
            attendanceRepo.save(record);

            application.setAttendanceStatus(status);

            if (application.getAttendedDays() != null &&
                    application.getAttendedDays() >= totalDays) {
                application.setAttendanceCompleted(true);
            }
        }

        applicationRepo.save(application);

        // email + percentage logic (UNCHANGED)
        User volunteer = userRepo.findById(application.getVolunteerId()).orElse(null);

        if (volunteer != null && event != null) {

            List<EventApplication> allApps =
                    applicationRepo.findByVolunteerId(volunteer.getId());

            long presentCount = allApps.stream()
                    .filter(a -> a.getAttendanceStatus() == AttendanceStatus.PRESENT)
                    .count();

            long totalCount = allApps.stream()
                    .filter(a -> a.getAttendanceStatus() != null)
                    .count();

            double percentage = 0;
            if (totalCount > 0) {
                percentage = (presentCount * 100.0) / totalCount;
            }

            String alertMsg = "";
            if (percentage < 75) {
                alertMsg =
                        "\n⚠ ALERT: Your attendance is below 75%. " +
                                "Please maintain regular participation.\n";
            }

            try {
                emailService.sendEmail(
                        volunteer.getEmail(),
                        "📌 Attendance Updated - VolunteerHub",
                        "Hi " + volunteer.getName() + ",\n\n" +
                                "Your attendance has been marked for the event:\n\n" +
                                "📌 Event: " + event.getTitle() + "\n" +
                                "✅ Status Today: " + status + "\n\n" +
                                "📊 Attendance Percentage: " +
                                String.format("%.2f", percentage) + "%\n" +
                                alertMsg +
                                "\nThank you for volunteering!\n\n" +
                                "- VolunteerHub Team"
                );
            } catch (Exception e) {
                System.out.println("❌ Attendance mail failed: " + e.getMessage());
            }

            if ("Completed".equalsIgnoreCase(event.getStatus())) {
                try {
                    emailService.sendEmail(
                            volunteer.getEmail(),
                            "🎉 Event Completed - VolunteerHub",
                            "Hi " + volunteer.getName() + ",\n\n" +
                                    "Congratulations! The event has been completed successfully.\n\n" +
                                    "📌 Event: " + event.getTitle() + "\n\n" +
                                    "Thank you for your valuable participation.\n\n" +
                                    "- VolunteerHub Team"
                    );
                } catch (Exception e) {
                    System.out.println("❌ Completed mail failed: " + e.getMessage());
                }
            }
        }

        return toDTO(application);
    }

    // ================= REMOVE VOLUNTEER =================
    public EventApplication removeVolunteer(Long id) {

        EventApplication app = applicationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED".equalsIgnoreCase(app.getStatus())) {
            throw new RuntimeException("Only approved volunteers can be removed!");
        }

        app.setStatus("REMOVED");
        return applicationRepo.save(app);
    }

    // ================= DTO MAPPER =================
    private VolunteerApplicationDTO toDTO(EventApplication app) {

        VolunteerApplicationDTO dto = new VolunteerApplicationDTO();

        dto.setId(app.getId());
        dto.setEventId(app.getEventId());
        dto.setVolunteerId(app.getVolunteerId());
        dto.setStatus(app.getStatus());
        dto.setAttendanceStatus(app.getAttendanceStatus());
        dto.setAttendedDays(app.getAttendedDays());
        dto.setTotalDays(app.getTotalDays());
        dto.setAttendanceCompleted(app.getAttendanceCompleted());

        User volunteer = userRepo.findById(app.getVolunteerId()).orElse(null);
        if (volunteer != null) {
            dto.setVolunteerName(volunteer.getName());
            dto.setVolunteerEmail(volunteer.getEmail());
        }

        Event event = eventRepo.findById(app.getEventId()).orElse(null);
        if (event != null) {
            dto.setEventTitle(event.getTitle());

            if (event.getStartDate() != null && event.getEndDate() != null) {
                if (event.getStartDate().equals(event.getEndDate())) {
                    dto.setEventDate(event.getStartDate().toString());
                } else {
                    dto.setEventDate(
                            event.getStartDate() + " to " + event.getEndDate()
                    );
                }
            }
        }

        return dto;
    }
}
