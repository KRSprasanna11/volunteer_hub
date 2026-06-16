package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // Get tickets by user
    List<SupportTicket> findByUserIdAndUserRole(Long userId, String userRole);
}
