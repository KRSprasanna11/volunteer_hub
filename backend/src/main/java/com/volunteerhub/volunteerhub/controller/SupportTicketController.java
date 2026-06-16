package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.SupportTicketDTO;
import com.volunteerhub.volunteerhub.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportTicketController {

    @Autowired
    private SupportTicketService supportTicketService;

    // Create new support ticket (Organizer or Volunteer)
    @PostMapping("/create")
    public SupportTicketDTO createTicket(@RequestBody SupportTicketDTO ticketDTO) {
        return supportTicketService.createTicket(ticketDTO);
    }

    // Get tickets for a specific user
    @GetMapping("/user")
    public List<SupportTicketDTO> getUserTickets(
            @RequestParam Long userId,
            @RequestParam String userRole) {

        return supportTicketService.getTicketsByUser(userId, userRole);
    }

    // Admin: Get all support tickets
    @GetMapping("/all")
    public List<SupportTicketDTO> getAllTickets() {
        return supportTicketService.getAllTickets();
    }

    // Admin: Mark ticket as resolved
    @PutMapping("/{id}/resolve")
    public SupportTicketDTO resolveTicket(@PathVariable Long id) {
        return supportTicketService.resolveTicket(id);
    }
}
