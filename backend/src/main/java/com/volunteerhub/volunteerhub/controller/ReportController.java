package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.ReportDTO;
import com.volunteerhub.volunteerhub.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3001")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ==================================================
    // ✅ Organizer Report API (ALL EVENTS)
    // ==================================================
    @GetMapping("/organizer/{id}")
    public ReportDTO getOrganizerReport(@PathVariable Long id) {
        return reportService.generateReport(id);
    }

    // ==================================================
    // ✅ Organizer Report API (FILTER BY EVENT)
    // ==================================================
    @GetMapping("/organizer/{id}/event/{eventId}")
    public ReportDTO getOrganizerReportByEvent(
            @PathVariable Long id,
            @PathVariable Long eventId
    ) {
        return reportService.generateReportByEvent(id, eventId);
    }
}
