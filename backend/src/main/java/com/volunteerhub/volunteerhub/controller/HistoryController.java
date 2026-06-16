package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.VolunteerHistoryDTO;
import com.volunteerhub.volunteerhub.service.HistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/volunteer")
@CrossOrigin(origins = "http://localhost:3001")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    // ✅ Volunteer History API (Matches Frontend URL)
    @GetMapping("/{volunteerId}/history")
    public List<VolunteerHistoryDTO> getHistory(
            @PathVariable Long volunteerId
    ) {
        return historyService.getVolunteerHistory(volunteerId);
    }
}
