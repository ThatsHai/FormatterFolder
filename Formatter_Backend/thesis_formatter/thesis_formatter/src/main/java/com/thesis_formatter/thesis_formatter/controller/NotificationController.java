package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.NotificationRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.NotificationResponse;
import com.thesis_formatter.thesis_formatter.entity.Notification;
import com.thesis_formatter.thesis_formatter.service.NotificationService;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/system")
    public APIResponse<Void> systemNotification(@RequestBody NotificationRequest notification) throws MessagingException {
        return notificationService.createSystemNotification(notification);
    }

    @PostMapping("/user")
    public APIResponse<Void> userNotification(@RequestBody NotificationRequest notification) throws MessagingException {
        return notificationService.createUserNotification(notification);
    }

    @GetMapping
    public APIResponse<List<NotificationResponse>> getNotificationsForAccount(@RequestParam String userId, @RequestParam String page, @RequestParam String number) {
        return notificationService.getNotificationsForAccount(userId, page, number);
    }

    @PutMapping("/markAsRead")
    public APIResponse<Void> markAsRead(@RequestParam String notificationId) throws MessagingException {
        return notificationService.markNotificationAsRead(notificationId);
    }
}
