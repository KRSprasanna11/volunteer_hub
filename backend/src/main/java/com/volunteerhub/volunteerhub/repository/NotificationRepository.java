package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 🔔 Get notifications for a specific user (organizer), latest first
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    // 🔴 Count unread notifications (badge count)
    long countByRecipientIdAndIsReadFalse(Long recipientId);

    // 🗑 Delete all notifications of organizer
    void deleteByRecipientId(Long recipientId);
}
