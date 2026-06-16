package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.SupportTicketDTO;
import com.volunteerhub.volunteerhub.model.SupportTicket;
import com.volunteerhub.volunteerhub.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketServiceImpl implements SupportTicketService {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Override
    public SupportTicketDTO createTicket(SupportTicketDTO ticketDTO) {

        SupportTicket ticket = new SupportTicket(
                ticketDTO.getUserId(),
                ticketDTO.getUserRole(),
                ticketDTO.getSubject(),
                ticketDTO.getMessage()
        );

        SupportTicket saved = supportTicketRepository.save(ticket);

        return new SupportTicketDTO(
                saved.getId(),
                saved.getUserId(),
                saved.getUserRole(),
                saved.getSubject(),
                saved.getMessage(),
                saved.getStatus(),
                saved.getCreatedAt()
        );
    }

    @Override
    public List<SupportTicketDTO> getTicketsByUser(Long userId, String userRole) {

        List<SupportTicket> tickets =
                supportTicketRepository.findByUserIdAndUserRole(userId, userRole);

        return tickets.stream()
                .map(ticket -> new SupportTicketDTO(
                        ticket.getId(),
                        ticket.getUserId(),
                        ticket.getUserRole(),
                        ticket.getSubject(),
                        ticket.getMessage(),
                        ticket.getStatus(),
                        ticket.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // Admin: get all tickets
    @Override
    public List<SupportTicketDTO> getAllTickets() {

        List<SupportTicket> tickets = supportTicketRepository.findAll();

        return tickets.stream()
                .map(ticket -> new SupportTicketDTO(
                        ticket.getId(),
                        ticket.getUserId(),
                        ticket.getUserRole(),
                        ticket.getSubject(),
                        ticket.getMessage(),
                        ticket.getStatus(),
                        ticket.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // Admin: resolve ticket
    @Override
    public SupportTicketDTO resolveTicket(Long id) {

        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus("RESOLVED");
        SupportTicket updated = supportTicketRepository.save(ticket);

        return new SupportTicketDTO(
                updated.getId(),
                updated.getUserId(),
                updated.getUserRole(),
                updated.getSubject(),
                updated.getMessage(),
                updated.getStatus(),
                updated.getCreatedAt()
        );
    }
}
