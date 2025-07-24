package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Notification;
import com.thesis_formatter.thesis_formatter.entity.NotificationReceiver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationReceiverRepo extends JpaRepository<NotificationReceiver, String> {
    Page<NotificationReceiver> findByReceiver_UserId(String userId, Pageable pageable);

    NotificationReceiver findByReceiver_UserIdAndNotification_Id(String userId, String notificationId);
}