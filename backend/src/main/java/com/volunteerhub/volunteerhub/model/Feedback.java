package com.volunteerhub.volunteerhub.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private Long volunteerId;

    // ✅ REQUIRED FIX: Add Organizer ID for filtering
    private Long organizerId;

    private int rating; // 1 to 5 stars
    private String comment;

    private LocalDate createdDate = LocalDate.now();
}
