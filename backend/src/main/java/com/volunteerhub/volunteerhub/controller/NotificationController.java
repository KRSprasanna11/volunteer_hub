package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.Notification;
import com.volunteerhub.volunteerhub.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3001")
public class NotificationController {

    private final NotificationRepository notificationRepo;

    public NotificationController(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    // 🔔 Organizer notifications (latest first)
    @GetMapping("/organizer/{organizerId}")
    public List<Notification> getOrganizerNotifications(
            @PathVariable Long organizerId
    ) {
        return notificationRepo
                .findByRecipientIdOrderByCreatedAtDesc(organizerId);
    }

    // 🔴 Unread notifications count (badge count) — FIXED
    @GetMapping("/organizer/{organizerId}/unread-count")
    public long getUnreadCount(@PathVariable Long organizerId) {
        return notificationRepo.countByRecipientIdAndIsReadFalse(organizerId);
    }

    // ✅ Mark all notifications as read
    @PutMapping("/organizer/{organizerId}/mark-read")
    public void markAllAsRead(@PathVariable Long organizerId) {
        List<Notification> notifications =
                notificationRepo.findByRecipientIdOrderByCreatedAtDesc(organizerId);

        notifications.forEach(notification -> notification.setRead(true));
        notificationRepo.saveAll(notifications);
    }

    // 🗑 Clear all notifications of organizer
    @DeleteMapping("/organizer/{organizerId}")
    public void clearNotifications(@PathVariable Long organizerId) {
        notificationRepo.deleteByRecipientId(organizerId);
    }

    // 🗑 Delete single notification
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationRepo.deleteById(id);
    }
}
