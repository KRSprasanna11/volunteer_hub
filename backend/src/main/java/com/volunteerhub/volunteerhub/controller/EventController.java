package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.EventFullResponseDTO;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import com.volunteerhub.volunteerhub.service.EmailService;
import com.volunteerhub.volunteerhub.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3001")
public class EventController {

    private final EventService eventService;

    // ✅ Needed for Volunteer Email Notification
    private final EmailService emailService;
    private final UserRepository userRepository;

    public EventController(EventService eventService,
                           EmailService emailService,
                           UserRepository userRepository) {
        this.eventService = eventService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    // ======================= EVENTS =======================

    // ✅ CREATE EVENT
    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {

        // ✅ Save Event First
        Event savedEvent = eventService.save(event);

        // ✅ Send Email to All Volunteers (Must NOT break event creation)
        try {

            List<User> volunteers = userRepository.findByRole("VOLUNTEER");

            for (User volunteer : volunteers) {

                // ✅ UPDATED FULL DETAILS EMAIL BODY
                emailService.sendEmail(
                        volunteer.getEmail(),
                        "New Event Available - VolunteerHub 🎉",
                        "Hi " + volunteer.getName() + ",\n\n" +
                                "A new volunteering event has been created!\n\n" +

                                "📌 Event Name: " + savedEvent.getTitle() + "\n" +
                                "🏙 City: " + savedEvent.getCity() + "\n" +
                                "📍 Location: " + savedEvent.getLocationName() + "\n" +

                                "📅 Start Date: " + savedEvent.getStartDate() + "\n" +
                                "⏰ Time: " + savedEvent.getStartTime() + " to " + savedEvent.getEndTime() + "\n" +

                                "👥 Total Slots Available: " + savedEvent.getTotalSlots() + "\n\n" +

                                "Login to VolunteerHub to apply now!\n\n" +
                                "- VolunteerHub Team"
                );
            }

        } catch (Exception e) {
            System.out.println("❌ Email sending failed, but event created successfully.");
        }

        return savedEvent;
    }

    // ✅ GET ALL EVENTS
    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ✅ GET EVENTS BY ORGANIZER
    @GetMapping("/events/organizer/{organizerId}")
    public List<Event> getOrganizerEvents(@PathVariable Long organizerId) {
        return eventService.getEventsByOrganizer(organizerId);
    }

    // ✅ GET AVAILABLE EVENTS (FOR VOLUNTEERS)
    @GetMapping("/events/available")
    public List<EventFullResponseDTO> getAvailableEvents() {
        return eventService.getAvailableEvents();
    }

    // ==================================================
    // ✅ NEW FEATURE 1: EDIT EVENT API
    // ==================================================
    @PutMapping("/events/{id}")
    public Event updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent
    ) {
        return eventService.updateEvent(id, updatedEvent);
    }

    // ==================================================
    // ✅ NEW FEATURE 2: CANCEL EVENT API
    // ==================================================
    @PutMapping("/events/{id}/cancel")
    public Event cancelEvent(@PathVariable Long id) {
        return eventService.cancelEvent(id);
    }
}
