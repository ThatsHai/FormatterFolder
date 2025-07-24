package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.NotificationRequest;
import com.thesis_formatter.thesis_formatter.dto.request.SendEmailRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.NotificationResponse;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.Notification;
import com.thesis_formatter.thesis_formatter.entity.NotificationReceiver;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import com.thesis_formatter.thesis_formatter.repo.NotificationReceiverRepo;
import com.thesis_formatter.thesis_formatter.repo.NotificationRepo;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepo notificationRepo;
    private final AccountRepo accountRepo;
    private final NotificationReceiverRepo notificationReceiverRepo;
    private final EmailService emailService;

    private Notification createNotification(NotificationRequest request) {
        Account sender = null;
        if (request.getSenderId() != null) {
            System.out.println("user" + request.getSenderId());
            sender = accountRepo.findByUserId(request.getSenderId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        }

        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .sender(sender)
                .build();

        List<Account> receivers = accountRepo.findByUserIdIn(request.getRecipientIds());
        List<NotificationReceiver> receiverList = receivers.stream()
                .map(receiver -> NotificationReceiver.builder()
                        .notification(notification)
                        .receiver(receiver)
                        .isRead(false)
                        .build())
                .toList();

        notification.setReceivers(receiverList);
        notificationRepo.save(notification);

        return notification;

    }

    //system
    public APIResponse<Void> createSystemNotification(NotificationRequest request) throws MessagingException {
        Notification notification = createNotification(request);
        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .sender("Hệ thống")
                .toEmails(notification.getReceivers().stream().map(receiver -> receiver.getReceiver().getEmail()).toArray(String[]::new))
                .subject(notification.getTitle())
                .message(notification.getMessage())
                .actionText("Xem chi tiết")
                .actionUrl("http://localhost:5173")
                .build();
        emailService.sendHtmlEmail(sendEmailRequest);

        return APIResponse.<Void>builder()
                .code("200")
                .message("Successfully created system notification and send email")
                .build();
    }

    //from user
    public APIResponse<Void> createUserNotification(NotificationRequest request) throws MessagingException {
        Notification notification = createNotification(request);
        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .sender(notification.getSender().getName())
                .toEmails(notification.getReceivers().stream().map(receiver -> receiver.getReceiver().getEmail()).toArray(String[]::new))
                .subject(notification.getTitle())
                .message(notification.getMessage())
                .actionText("Xem chi tiết")
                .actionUrl("http://localhost:5173")
                .build();
        emailService.sendHtmlEmail(sendEmailRequest);

        return APIResponse.<Void>builder()
                .code("200")
                .message("Successfully created user notification and send email")
                .build();
    }

    public APIResponse<List<NotificationResponse>> getNotificationForAccount(String userId, String page, String numberOfNotification) throws AppException {

        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfNotification));
        Page<NotificationReceiver> notificationReceivers = notificationReceiverRepo.findByReceiver_UserId(userId, pageable);

        List<NotificationResponse> notificationResponses = notificationReceivers.stream()
                .map(receiver -> {
                    Notification notification = receiver.getNotification();
                    return NotificationResponse.builder()
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .isRead(receiver.isRead())
                            .createdAt(notification.getCreatedAt())
                            .senderName(notification.getSender() != null ? notification.getSender().getName() : "Hệ thống")
                            .build();
                })
                .sorted(Comparator.comparing(NotificationResponse::getCreatedAt).reversed()) //lastest
                .toList();

        return APIResponse.<List<NotificationResponse>>builder()
                .code("200")
                .result(notificationResponses)
                .build();
    }
}

