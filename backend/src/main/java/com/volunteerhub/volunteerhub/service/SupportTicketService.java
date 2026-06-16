package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.SupportTicketDTO;

import java.util.List;

public interface SupportTicketService {

    // Create a new support ticket
    SupportTicketDTO createTicket(SupportTicketDTO ticketDTO);

    // Get tickets for a specific user (volunteer or organizer)
    List<SupportTicketDTO> getTicketsByUser(Long userId, String userRole);

    // Admin: get all tickets
    List<SupportTicketDTO> getAllTickets();

    // Admin: resolve ticket
    SupportTicketDTO resolveTicket(Long id);
}
