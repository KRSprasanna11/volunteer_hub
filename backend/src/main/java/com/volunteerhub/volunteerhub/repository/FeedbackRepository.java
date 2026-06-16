package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // ✅ Check if volunteer already submitted feedback
    boolean existsByEventIdAndVolunteerId(Long eventId, Long volunteerId);

    // ✅ Organizer Reports Support (All Feedback)
    List<Feedback> findByOrganizerId(Long organizerId);

    // ✅ Event Filter Support
    List<Feedback> findByEventId(Long eventId);

    // ✅ Required for Organizer Feedback Summary (Multiple Events)
    List<Feedback> findByEventIdIn(List<Long> eventIds);
}
