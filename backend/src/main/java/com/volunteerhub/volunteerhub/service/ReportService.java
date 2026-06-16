package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.ReportDTO;
import com.volunteerhub.volunteerhub.model.AttendanceRecord;
import com.volunteerhub.volunteerhub.model.Event;
import com.volunteerhub.volunteerhub.model.EventApplication;
import com.volunteerhub.volunteerhub.model.Feedback;
import com.volunteerhub.volunteerhub.repository.AttendanceRecordRepository;
import com.volunteerhub.volunteerhub.repository.EventApplicationRepository;
import com.volunteerhub.volunteerhub.repository.EventRepository;
import com.volunteerhub.volunteerhub.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final EventRepository eventRepo;
    private final EventApplicationRepository appRepo;
    private final AttendanceRecordRepository attendanceRepo;

    // ✅ Feedback Repository Added
    private final FeedbackRepository feedbackRepo;

    public ReportService(EventRepository eventRepo,
                         EventApplicationRepository appRepo,
                         AttendanceRecordRepository attendanceRepo,
                         FeedbackRepository feedbackRepo) {

        this.eventRepo = eventRepo;
        this.appRepo = appRepo;
        this.attendanceRepo = attendanceRepo;
        this.feedbackRepo = feedbackRepo;
    }

    // ==================================================
    // ✅ MAIN REPORT GENERATOR (ALL EVENTS)
    // ==================================================
    public ReportDTO generateReport(Long organizerId) {

        ReportDTO dto = new ReportDTO();

        // ================= EVENTS =================
        List<Event> events = eventRepo.findByCreatedBy(organizerId);

        dto.totalEvents = events.size();

        // ✅ FIX 1: Correct Completed Status Check (Matches DB Value)
        dto.completedEvents = (int) events.stream()
                .filter(e -> e.getStatus() != null &&
                        e.getStatus().equalsIgnoreCase("Completed"))
                .count();

        dto.cancelledEvents = (int) events.stream()
                .filter(e -> e.getStatus() != null &&
                        e.getStatus().equalsIgnoreCase("Cancelled"))
                .count();

        dto.upcomingEvents = (int) events.stream()
                .filter(e -> e.getStartDate() != null &&
                        e.getStartDate().isAfter(LocalDate.now()))
                .count();

        // ✅ Completed Events List for Dropdown
        dto.completedEventList = events.stream()
                .filter(e -> e.getStatus() != null &&
                        e.getStatus().equalsIgnoreCase("Completed"))
                .collect(Collectors.toList());

        // ================= APPLICATIONS =================

        // ✅ FIX 2: Get all organizer event IDs
        List<Long> eventIds = events.stream()
                .map(Event::getId)
                .toList();

        // ✅ FIX 3: Fetch Applications using Event IDs (Correct Applied Count)
        List<EventApplication> apps =
                appRepo.findByEventIdIn(eventIds);

        dto.totalApplications = apps.size();

        dto.approved = (int) apps.stream()
                .filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus()))
                .count();

        dto.pending = (int) apps.stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus()))
                .count();

        dto.rejected = (int) apps.stream()
                .filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus()))
                .count();

        // ================= ATTENDANCE =================

        // ✅ Fetch attendance only for organizer events
        List<AttendanceRecord> records =
                attendanceRepo.findByEventIdIn(eventIds);

        dto.presentCount = (int) records.stream()
                .filter(r -> r.getStatus().name().equals("PRESENT"))
                .count();

        dto.absentCount = (int) records.stream()
                .filter(r -> r.getStatus().name().equals("ABSENT"))
                .count();

        int totalMarked = dto.presentCount + dto.absentCount;

        dto.attendancePercentage =
                totalMarked == 0 ? 0 :
                        (dto.presentCount * 100.0) / totalMarked;

        // ================= FEEDBACK REPORT (ALL EVENTS) =================

        List<Feedback> feedbacks =
                feedbackRepo.findByEventIdIn(eventIds);

        dto.feedbackCount = feedbacks.size();

        dto.averageRating =
                feedbacks.isEmpty() ? 0 :
                        feedbacks.stream()
                                .mapToInt(Feedback::getRating)
                                .average()
                                .orElse(0);

        dto.recentComments = feedbacks.stream()
                .map(Feedback::getComment)
                .filter(c -> c != null && !c.trim().isEmpty())
                .limit(5)
                .collect(Collectors.toList());

        return dto;
    }

    // ==================================================
    // ✅ ORGANIZER REPORT BY EVENT (FULL EVENT REPORT)
    // ==================================================
    public ReportDTO generateReportByEvent(Long organizerId, Long eventId) {

        ReportDTO dto = new ReportDTO();

        dto.totalEvents = 1;

        List<EventApplication> apps =
                appRepo.findByOrganizerIdAndEventId(organizerId, eventId);

        dto.totalApplications = apps.size();

        dto.approved = (int) apps.stream()
                .filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus()))
                .count();

        dto.pending = (int) apps.stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus()))
                .count();

        dto.rejected = (int) apps.stream()
                .filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus()))
                .count();

        // ✅ Attendance must be fetched only by EventId
        List<AttendanceRecord> records =
                attendanceRepo.findByEventId(eventId);

        dto.presentCount = (int) records.stream()
                .filter(r -> r.getStatus().name().equals("PRESENT"))
                .count();

        dto.absentCount = (int) records.stream()
                .filter(r -> r.getStatus().name().equals("ABSENT"))
                .count();

        int totalMarked = dto.presentCount + dto.absentCount;

        dto.attendancePercentage =
                totalMarked == 0 ? 0 :
                        (dto.presentCount * 100.0) / totalMarked;

        List<Feedback> feedbacks =
                feedbackRepo.findByEventId(eventId);

        dto.feedbackCount = feedbacks.size();

        dto.averageRating =
                feedbacks.isEmpty() ? 0 :
                        feedbacks.stream()
                                .mapToInt(Feedback::getRating)
                                .average()
                                .orElse(0);

        dto.recentComments = feedbacks.stream()
                .map(Feedback::getComment)
                .filter(c -> c != null && !c.trim().isEmpty())
                .limit(5)
                .collect(Collectors.toList());

        return dto;
    }

    // ==================================================
    // ✅ EVENT FILTER REPORT (Feedback Only)
    // ==================================================
    public ReportDTO generateEventFeedbackReport(Long eventId) {

        ReportDTO dto = new ReportDTO();

        List<Feedback> feedbackList =
                feedbackRepo.findByEventId(eventId);

        dto.feedbackCount = feedbackList.size();

        dto.averageRating =
                feedbackList.isEmpty() ? 0 :
                        feedbackList.stream()
                                .mapToInt(Feedback::getRating)
                                .average()
                                .orElse(0);

        dto.recentComments = feedbackList.stream()
                .map(Feedback::getComment)
                .filter(c -> c != null && !c.trim().isEmpty())
                .collect(Collectors.toList());

        return dto;
    }
}
