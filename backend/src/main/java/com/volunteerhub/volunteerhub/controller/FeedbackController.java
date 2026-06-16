package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.Feedback;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.FeedbackRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3001")
public class FeedbackController {

    private final FeedbackRepository repo;
    private final EventRepository eventRepo;   // ✅ Added

    public FeedbackController(FeedbackRepository repo, EventRepository eventRepo) {
        this.repo = repo;
        this.eventRepo = eventRepo;
    }

    @PostMapping("/submit")
    public String submitFeedback(@RequestBody Feedback feedback) {

        // ✅ Prevent duplicate feedback
        if (repo.existsByEventIdAndVolunteerId(
                feedback.getEventId(),
                feedback.getVolunteerId()
        )) {
            return "ALREADY_GIVEN";
        }

        // ✅ FIX: Get Organizer ID from Event
        Event event = eventRepo.findById(feedback.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        feedback.setOrganizerId(event.getCreatedBy());

        // ✅ Save Feedback
        repo.save(feedback);

        return "FEEDBACK_SAVED";
    }
}
