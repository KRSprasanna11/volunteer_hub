package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.AttendanceStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventApplicationRepository
        extends JpaRepository<EventApplication, Long> {

    // ✅ Check if volunteer already applied
    Optional<EventApplication> findByEventIdAndVolunteerId(
            Long eventId,
            Long volunteerId
    );

    // ✅ Cancel participation
    Optional<EventApplication> findByVolunteerIdAndEventId(
            Long volunteerId,
            Long eventId
    );

    // ✅ Volunteer applications
    List<EventApplication> findByVolunteerId(Long volunteerId);

    // ✅ Organizer applications (Old - Keep)
    List<EventApplication> findByOrganizerId(Long organizerId);

    // ✅ Event applications
    List<EventApplication> findByEventId(Long eventId);

    // ==================================================
    // ✅ NEW REQUIRED FIX: Organizer Applications via Event IDs
    // ==================================================
    List<EventApplication> findByEventIdIn(List<Long> eventIds);

    // ✅ Organizer + Event Filter Support
    List<EventApplication> findByOrganizerIdAndEventId(
            Long organizerId,
            Long eventId
    );

    // ✅ History filter (Completed / Cancelled / Rejected)
    List<EventApplication> findByVolunteerIdAndStatusIn(
            Long volunteerId,
            List<String> statuses
    );

    // ✅ Attendance Filter
    List<EventApplication> findByAttendanceStatus(AttendanceStatus status);

    // ==================================================
    // ✅ REQUIRED FOR TOMORROW EVENT REMINDER MAIL
    // ==================================================
    List<EventApplication> findByStatus(String status);
}
