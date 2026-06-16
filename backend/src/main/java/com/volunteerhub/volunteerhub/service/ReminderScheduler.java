package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.EventApplicationRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderScheduler {

    private final EventRepository eventRepository;
    private final EventApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ReminderScheduler(EventRepository eventRepository,
                             EventApplicationRepository applicationRepository,
                             UserRepository userRepository,
                             EmailService emailService) {

        this.eventRepository = eventRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // ==================================================
    // ✅ DAILY EVENT REMINDER (Runs Every Day at 9 AM)
    // ==================================================
    @Scheduled(cron = "0 0 9 * * *")
    public void sendTomorrowEventReminder() {

        System.out.println("🔔 Running Tomorrow Event Reminder Scheduler...");

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // ✅ Get All Events
        List<Event> events = eventRepository.findAll();

        for (Event event : events) {

            // ✅ Check if Event Starts Tomorrow
            if (event.getStartDate() != null &&
                    event.getStartDate().isEqual(tomorrow)) {

                // ✅ Get Approved Applications for This Event
                List<EventApplication> approvedApps =
                        applicationRepository.findByEventId(event.getId())
                                .stream()
                                .filter(app -> "APPROVED".equalsIgnoreCase(app.getStatus()))
                                .toList();

                // ✅ Send Reminder Mail to Each Volunteer
                for (EventApplication app : approvedApps) {

                    User volunteer = userRepository
                            .findById(app.getVolunteerId())
                            .orElse(null);

                    if (volunteer != null) {

                        try {
                            emailService.sendEmail(
                                    volunteer.getEmail(),
                                    "⏰ Event Reminder - Starts Tomorrow!",
                                    "Hi " + volunteer.getName() + ",\n\n" +
                                            "This is a reminder that your event starts tomorrow.\n\n" +

                                            "📌 Event: " + event.getTitle() + "\n" +
                                            "📍 Location: " + event.getLocationName() + "\n" +
                                            "🏙 City: " + event.getCity() + "\n" +
                                            "📅 Date: " + event.getStartDate() + "\n" +
                                            "⏰ Time: " + event.getStartTime() + " to " + event.getEndTime() + "\n\n" +

                                            "Please be on time and thank you for volunteering!\n\n" +
                                            "- VolunteerHub Team"
                            );

                        } catch (Exception e) {
                            System.out.println("❌ Reminder email failed: " + e.getMessage());
                        }
                    }
                }
            }
        }

        System.out.println("✅ Tomorrow Event Reminder Completed.");
    }
}
