package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository
        extends JpaRepository<AttendanceRecord, Long> {

    // ==================================================
    // ✅ FIX: Find Attendance by Application + Date
    // ==================================================
    Optional<AttendanceRecord> findByApplicationIdAndAttendanceDate(
            Long applicationId,
            LocalDate attendanceDate
    );

    // ==================================================
    // ✅ Organizer Attendance Records Fetch
    // ==================================================
    @Query("""
        SELECT ar FROM AttendanceRecord ar
        JOIN EventApplication ea ON ar.applicationId = ea.id
        WHERE ea.organizerId = :organizerId
    """)
    List<AttendanceRecord> findByOrganizerId(Long organizerId);

    // ==================================================
    // ✅ Organizer + Event Attendance Records Fetch
    // ==================================================
    @Query("""
        SELECT ar FROM AttendanceRecord ar
        JOIN EventApplication ea ON ar.applicationId = ea.id
        WHERE ea.organizerId = :organizerId
          AND ea.eventId = :eventId
    """)
    List<AttendanceRecord> findByOrganizerIdAndEventId(
            Long organizerId,
            Long eventId
    );

    // ==================================================
    // ✅ Attendance Filter for Organizer Events (ALL EVENTS)
    // ==================================================
    List<AttendanceRecord> findByEventIdIn(List<Long> eventIds);

    // ==================================================
    // ✅ NEW REQUIRED FIX: Attendance for Single Event
    // ==================================================
    List<AttendanceRecord> findByEventId(Long eventId);

}
