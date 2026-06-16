package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.dto.EventFullResponseDTO;
import com.volunteerhub.volunteerhub.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // ✅ Fetch only organizer's events
    List<Event> findByCreatedBy(Long createdBy);

    // ✅ City-based event count (for chatbot)
    long countByCityIgnoreCase(String city);

    // ✅ Fetch all events with organizer name (for volunteers)
    @Query("""
        SELECT new com.volunteerhub.volunteerhub.dto.EventFullResponseDTO(
            e.id,
            e.title,
            e.category,
            e.description,
            e.startDate,
            e.endDate,
            e.startTime,
            e.endTime,

            e.registrationStartDate,
            e.registrationStartTime,
            e.registrationEndDate,
            e.registrationEndTime,

            e.locationName,
            e.address,
            e.city,
            e.area,
            e.mapLink,
            e.totalSlots,

            (e.totalSlots - (
                SELECT COUNT(a)
                FROM EventApplication a
                WHERE a.event.id = e.id
                AND a.status = 'APPROVED'
            )),

            e.minAge,
            e.genderPref,
            e.skills,
            u.name
        )
        FROM Event e
        JOIN User u ON e.createdBy = u.id
        WHERE e.status <> 'Cancelled'
    """)
    List<EventFullResponseDTO> findAllAvailableEvents();
}
