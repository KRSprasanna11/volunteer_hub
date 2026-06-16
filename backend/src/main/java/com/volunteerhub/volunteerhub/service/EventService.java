package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.EventFullResponseDTO;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // ✅ Email Service
    @Autowired
    private EmailService emailService;

    // ✅ User Repo (To get Organizer Email)
    @Autowired
    private UserRepository userRepository;

    // ✅ Correct Document Verification Service
    @Autowired
    private DocumentVerificationService documentVerificationService;

    // ==================================================
    // ✅ Organizer → Create Event (With Verification Block)
    // ==================================================
    public Event save(Event event) {

        // ==================================================
        // ✅ BLOCK UNVERIFIED ORGANIZER FROM CREATING EVENT
        // ==================================================
        if (!documentVerificationService
                .getUserDocument(event.getCreatedBy(), "ORGANIZER")
                .map(doc -> "APPROVED".equals(doc.getStatus()))
                .orElse(false)) {

            throw new RuntimeException(
                    "Organizer is not verified. Please upload documents for approval."
            );
        }

        return eventRepository.save(event);
    }

    // ✅ Volunteer → Get all events (RAW entity)
    public List<Event> getAllEvents() {

        List<Event> events = eventRepository.findAll();

        // ==================================================
        // ✅ AUTO COMPLETED + ORGANIZER MAIL FIX
        // ==================================================
        for (Event event : events) {

            if (event.getEndDate() != null &&
                    event.getEndDate().isBefore(LocalDate.now()) &&
                    !"Completed".equalsIgnoreCase(event.getStatus()) &&
                    !"Cancelled".equalsIgnoreCase(event.getStatus())) {

                // ✅ Mark Completed
                event.setStatus("Completed");
                eventRepository.save(event);

                // ✅ Send Mail to Organizer
                User organizer = userRepository
                        .findById(event.getCreatedBy())
                        .orElse(null);

                if (organizer != null) {
                    try {
                        emailService.sendEmail(
                                organizer.getEmail(),
                                "🎉 Event Completed - Certificate Distribution Ready",
                                "Hi " + organizer.getName() + ",\n\n" +
                                        "Your event has been successfully completed!\n\n" +

                                        "📌 Event Name: " + event.getTitle() + "\n" +
                                        "📅 End Date: " + event.getEndDate() + "\n\n" +

                                        "✅ Now the event is ready for certificate distribution.\n" +
                                        "Please login to Organizer Dashboard to issue certificates.\n\n" +

                                        "- VolunteerHub Team"
                        );
                    } catch (Exception e) {
                        System.out.println("❌ Organizer Completed Mail Failed: " + e.getMessage());
                    }
                }
            }
        }
        // ==================================================

        return events;
    }

    // ✅ Organizer → Get my events
    public List<Event> getEventsByOrganizer(Long organizerId) {

        List<Event> events = eventRepository.findByCreatedBy(organizerId);

        // ==================================================
        // ✅ AUTO COMPLETED + ORGANIZER MAIL FIX (Organizer Events)
        // ==================================================
        for (Event event : events) {

            if (event.getEndDate() != null &&
                    event.getEndDate().isBefore(LocalDate.now()) &&
                    !"Completed".equalsIgnoreCase(event.getStatus()) &&
                    !"Cancelled".equalsIgnoreCase(event.getStatus())) {

                // ✅ Mark Completed
                event.setStatus("Completed");
                eventRepository.save(event);

                // ✅ Send Organizer Mail Again
                User organizer = userRepository
                        .findById(event.getCreatedBy())
                        .orElse(null);

                if (organizer != null) {
                    try {
                        emailService.sendEmail(
                                organizer.getEmail(),
                                "🎉 Event Completed - Certificate Distribution Ready",
                                "Hi " + organizer.getName() + ",\n\n" +
                                        "Your event has been successfully completed!\n\n" +

                                        "📌 Event Name: " + event.getTitle() + "\n\n" +

                                        "Certificates can now be distributed to volunteers.\n\n" +
                                        "- VolunteerHub Team"
                        );
                    } catch (Exception e) {
                        System.out.println("❌ Organizer Completed Mail Failed: " + e.getMessage());
                    }
                }
            }
        }
        // ==================================================

        return events;
    }

    // ✅ Volunteer → Available events (WITH organizer name)
    public List<EventFullResponseDTO> getAvailableEvents() {
        return eventRepository.findAllAvailableEvents();
    }

    // ==================================================
    // ✅ FEATURE 1: EDIT EVENT
    // ==================================================
    public Event updateEvent(Long id, Event updatedEvent) {

        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ Prevent editing cancelled events
        if ("Cancelled".equalsIgnoreCase(existingEvent.getStatus())) {
            throw new RuntimeException("Cannot edit a cancelled event");
        }

        // ✅ Update only editable fields
        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setCategory(updatedEvent.getCategory());
        existingEvent.setDescription(updatedEvent.getDescription());

        existingEvent.setStartDate(updatedEvent.getStartDate());
        existingEvent.setEndDate(updatedEvent.getEndDate());
        existingEvent.setStartTime(updatedEvent.getStartTime());
        existingEvent.setEndTime(updatedEvent.getEndTime());

        // ==================================================
        // ✅ ONLY REQUIRED FIX (Registration Dates + Time)
        // ==================================================
        existingEvent.setRegistrationStartDate(updatedEvent.getRegistrationStartDate());
        existingEvent.setRegistrationStartTime(updatedEvent.getRegistrationStartTime());

        existingEvent.setRegistrationEndDate(updatedEvent.getRegistrationEndDate());
        existingEvent.setRegistrationEndTime(updatedEvent.getRegistrationEndTime());
        // ==================================================

        existingEvent.setLocationName(updatedEvent.getLocationName());
        existingEvent.setCity(updatedEvent.getCity());
        existingEvent.setAddress(updatedEvent.getAddress());

        existingEvent.setTotalSlots(updatedEvent.getTotalSlots());

        return eventRepository.save(existingEvent);
    }

    // ==================================================
    // ✅ FEATURE 2: CANCEL EVENT
    // ==================================================
    public Event cancelEvent(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ Mark event as Cancelled
        event.setStatus("Cancelled");

        return eventRepository.save(event);
    }

    // ==================================================
    // ✅ REQUIRED FOR APPLICATION EMAIL NOTIFICATION
    // ==================================================
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
}
