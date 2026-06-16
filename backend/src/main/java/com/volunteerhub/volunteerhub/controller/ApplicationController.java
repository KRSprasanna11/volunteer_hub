package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.VolunteerApplicationDTO;
import com.volunteerhub.volunteerhub.dto.VolunteerMyEventDTO;
import com.volunteerhub.volunteerhub.model.AttendanceStatus;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import com.volunteerhub.volunteerhub.service.EmailService;
import com.volunteerhub.volunteerhub.service.EventApplicationService;
import com.volunteerhub.volunteerhub.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3001")
public class ApplicationController {

    @Autowired
    private EventApplicationService applicationService;

    // ✅ Needed for Organizer Mail Notification
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventService eventService;

    // ==================================================
    // ✅ APPLY API (Volunteer Apply Button)
    // ==================================================
    @PostMapping("/apply")
    public String apply(
            @RequestParam Long eventId,
            @RequestParam Long volunteerId
    ) {

        // ✅ Apply First
        String result = applicationService.apply(eventId, volunteerId);

        // ✅ Send Mail Only if Application Successful
        if (result.toLowerCase().contains("success")) {

            // 🔍 Get Event Details
            Event event = eventService.getEventById(eventId);

            // 🔍 Get Volunteer Details
            User volunteer = userRepository.findById(volunteerId).orElse(null);

            // 🔍 Get Organizer Details
            User organizer = userRepository.findById(event.getCreatedBy()).orElse(null);

            if (organizer != null && volunteer != null) {

                emailService.sendEmail(
                        organizer.getEmail(),
                        "New Volunteer Application - VolunteerHub 📩",
                        "Hi " + organizer.getName() + ",\n\n" +
                                "A volunteer has applied for your event.\n\n" +

                                "📌 Event Name: " + event.getTitle() + "\n" +
                                "👤 Volunteer Name: " + volunteer.getName() + "\n" +
                                "📧 Volunteer Email: " + volunteer.getEmail() + "\n\n" +

                                "Please login to VolunteerHub Organizer Dashboard to approve or reject.\n\n" +
                                "- VolunteerHub Team"
                );
            }
        }

        return result;
    }

    // ==================================================
    // ✅ APPROVE / REJECT APPLICATION API
    // ==================================================
    @PutMapping("/{id}/status")
    public EventApplication updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return applicationService.updateStatus(id, status);
    }

    // ==================================================
    // ✅ VOLUNTEER GET APPLICATIONS API
    // Frontend uses this to show Pending/Approved
    // ==================================================
    @GetMapping("/volunteer/{volunteerId}")
    public List<EventApplication> getForVolunteer(
            @PathVariable Long volunteerId
    ) {
        return applicationService.getApplicationsForVolunteer(volunteerId);
    }

    // ==================================================
    // ✅ VOLUNTEER MY EVENTS API (Approved Events Only)
    // ==================================================
    @GetMapping("/volunteer/{volunteerId}/events")
    public List<VolunteerMyEventDTO> getVolunteerEvents(
            @PathVariable Long volunteerId
    ) {
        return applicationService.getVolunteerEvents(volunteerId);
    }

    // ==================================================
    // ✅ ORGANIZER GET APPLICATIONS API
    // Returns VolunteerApplicationDTO list
    // ==================================================
    @GetMapping("/organizer/{organizerId}")
    public List<VolunteerApplicationDTO> getForOrganizer(
            @PathVariable Long organizerId
    ) {
        return applicationService.getApplicationsForOrganizer(organizerId);
    }

    // ==================================================
    // ✅ EVENT GET APPLICATIONS API
    // Returns VolunteerApplicationDTO list
    // ==================================================
    @GetMapping("/event/{eventId}")
    public List<VolunteerApplicationDTO> getForEvent(
            @PathVariable Long eventId
    ) {
        return applicationService.getApplicationsForEvent(eventId);
    }

    // ==================================================
    // ✅ ATTENDANCE UPDATE API (FINAL FIX ✅)
    // Returns VolunteerApplicationDTO (Correct)
    // ==================================================
    @PutMapping("/attendance/{id}")
    public VolunteerApplicationDTO updateAttendance(
            @PathVariable Long id,
            @RequestParam AttendanceStatus status
    ) {
        return applicationService.markAttendance(id, status);
    }

    // ==================================================
    // ✅ REMOVE VOLUNTEER API (Organizer Removes Volunteer)
    // ==================================================
    @PutMapping("/{id}/remove")
    public EventApplication removeVolunteer(
            @PathVariable Long id
    ) {
        return applicationService.removeVolunteer(id);
    }
}
