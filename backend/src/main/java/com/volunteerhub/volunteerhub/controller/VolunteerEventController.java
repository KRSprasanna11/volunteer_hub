package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.Application;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.repository.ApplicationRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/volunteer/my-events")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerEventController {

    private final ApplicationRepository applicationRepo;
    private final EventRepository eventRepo;

    public VolunteerEventController(ApplicationRepository applicationRepo,
                                    EventRepository eventRepo) {
        this.applicationRepo = applicationRepo;
        this.eventRepo = eventRepo;
    }

    @GetMapping("/{volunteerId}")
    public List<Map<String, Object>> getMyEvents(@PathVariable Long volunteerId) {

        List<Application> applications =
                applicationRepo.findByVolunteerId(volunteerId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : applications) {
            Event event = eventRepo.findById(app.getEventId()).orElse(null);
            if (event == null) continue;

            Map<String, Object> map = new HashMap<>();
            map.put("eventId", event.getId());
            map.put("title", event.getTitle());
            map.put("description", event.getDescription());
            map.put("status", app.getStatus());

            result.add(map);
        }

        return result;
    }
}
