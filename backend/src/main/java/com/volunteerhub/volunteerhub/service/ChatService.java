package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private EventRepository eventRepository;

    public String getReply(String message) {

        String msg = message.toLowerCase();

        // ================= GREETINGS =================
        if (msg.contains("hi") || msg.contains("hello")) {
            return "Hello! Welcome to VolunteerHub. How can I assist you today?";
        }

        // ================= ABOUT APP =================
        if (msg.contains("about") || msg.contains("app") || msg.contains("volunteerhub")) {
            return "VolunteerHub is a platform that connects volunteers and organizers. "
                    + "You can join events, track attendance, and earn certificates.";
        }

        // ================= EVENTS =================
        if (msg.contains("event") && msg.contains("how")) {
            return "To view events, login as a volunteer and open the 'Available Events' section.";
        }

        if (msg.contains("event") && msg.contains("available")) {
            long count = eventRepository.count();
            return "Currently, there are " + count + " events available on the platform.";
        }

        // ================= CITY BASED EVENTS =================
        if (msg.contains("event in")) {
            try {
                String city = msg.replace("event in", "").trim();

                long count = eventRepository.countByCityIgnoreCase(city);

                if (count == 0) {
                    return "No events available in " + city + " right now.";
                }

                return "There are " + count + " events available in " + city + ". "
                        + "Check the 'Available Events' section.";
            } catch (Exception e) {
                return "Please ask like: events in Chennai";
            }
        }

        if (msg.contains("event")) {
            return "You can view available events in the Volunteer dashboard under 'Available Events'.";
        }

        // ================= APPLY =================
        if (msg.contains("apply")) {
            return "To apply:\n"
                    + "1. Login as a volunteer\n"
                    + "2. Open 'Available Events'\n"
                    + "3. Click the 'Apply' button on the event";
        }

        // ================= USER SPECIFIC =================
        if (msg.contains("my events")) {
            return "You can see your applied events in the 'My Events' section.";
        }

        if (msg.contains("my certificate")) {
            return "You can download your certificates from the 'Certificates' section.";
        }

        if (msg.contains("my attendance")) {
            return "Your attendance details are available in 'My Events' or 'History'.";
        }

        // ================= ATTENDANCE =================
        if (msg.contains("attendance")) {
            return "Your attendance is marked by the organizer after each event. "
                    + "You can check it in 'My Events' or 'History' section.";
        }

        // ================= CERTIFICATE =================
        if (msg.contains("certificate")) {
            return "Certificates are issued after event completion. "
                    + "You can download them from the 'Certificates' section.";
        }

        // ================= ORGANIZER =================
        if (msg.contains("organizer")) {
            return "Organizers can:\n"
                    + "• Create events\n"
                    + "• Approve volunteers\n"
                    + "• Mark attendance\n"
                    + "• Issue certificates";
        }

        // ================= REGISTRATION =================
        if (msg.contains("register") || msg.contains("signup")) {
            return "Click 'Join as Volunteer' or 'Create an Event' on the homepage to register.";
        }

        // ================= LOGIN =================
        if (msg.contains("login")) {
            return "Use your registered email and password to log in to VolunteerHub.";
        }

        // ================= CONTACT =================
        if (msg.contains("contact") || msg.contains("support")) {
            return "For support, please contact the VolunteerHub team through the contact section.";
        }

        // ================= DEFAULT =================
        return "I’m your VolunteerHub assistant 🤖\n\n"
                + "You can ask me about:\n"
                + "• Available events\n"
                + "• How to apply\n"
                + "• Attendance\n"
                + "• Certificates\n"
                + "• Organizer features\n\n"
                + "What would you like to know?";
    }
}
