package com.volunteerhub.volunteerhub.dto;

import com.volunteerhub.volunteerhub.model.Event;
import java.util.List;

public class ReportDTO {

    // ================= EVENT REPORT =================
    public int totalEvents;
    public int completedEvents;
    public int upcomingEvents;
    public int cancelledEvents;

    // ================= APPLICATION REPORT =================
    public int totalApplications;
    public int approved;
    public int pending;
    public int rejected;

    // ================= ATTENDANCE REPORT =================
    public int presentCount;
    public int absentCount;
    public double attendancePercentage;

    // ================= FEEDBACK REPORT =================
    public int feedbackCount;
    public double averageRating;
    public List<String> recentComments;

    // ✅ ADD THIS (For Dropdown Completed Events List)
    public List<Event> completedEventList;
}
