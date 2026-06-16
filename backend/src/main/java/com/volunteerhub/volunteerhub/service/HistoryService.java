package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.VolunteerHistoryDTO;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.EventApplicationRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {

    private final EventApplicationRepository applicationRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;

    public HistoryService(
            EventApplicationRepository applicationRepo,
            EventRepository eventRepo,
            UserRepository userRepo
    ) {
        this.applicationRepo = applicationRepo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
    }

    public List<VolunteerHistoryDTO> getVolunteerHistory(Long volunteerId) {

        // ✅ Only Completed, Cancelled, Rejected Applications
        List<EventApplication> apps =
                applicationRepo.findByVolunteerIdAndStatusIn(
                        volunteerId,
                        List.of("COMPLETED", "CANCELLED", "REJECTED")
                );

        return apps.stream().map(app -> {

            // ✅ Fetch Event Details
            Event event = eventRepo.findById(app.getEventId()).orElse(null);

            // ✅ Fetch Organizer Details
            User organizer = userRepo.findById(app.getOrganizerId()).orElse(null);

            return new VolunteerHistoryDTO(
                    app.getId(),

                    // ✅ Event Title
                    event != null ? event.getTitle() : "N/A",

                    // ✅ Organizer Name
                    organizer != null ? organizer.getName() : "N/A",

                    // ✅ Status
                    app.getStatus(),

                    // ✅ Updated Time
                    app.getUpdatedAt(),

                    // ✅ Extra Event Details for UI
                    event != null ? event.getStartDate() : null,
                    event != null ? event.getStartTime() : null,
                    event != null ? event.getEndTime() : null
            );

        }).toList();
    }
}
