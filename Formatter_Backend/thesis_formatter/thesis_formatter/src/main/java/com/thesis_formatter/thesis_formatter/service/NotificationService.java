package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.NotificationRequest;
import com.thesis_formatter.thesis_formatter.dto.request.SendEmailRequest;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.*;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.Month;
import java.time.MonthDay;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepo notificationRepo;
    private final AccountRepo accountRepo;
    private final NotificationReceiverRepo notificationReceiverRepo;
    private final EmailService emailService;
    private final StudentRepo studentRepo;
    private final DepartmentService departmentService;
    private final DepartmentRepo departmentRepo;
    private final TeacherRepo teacherRepo;

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

//        List<Account> receivers = accountRepo.findByUserIdIn(request.getRecipientIds());
        List<Account> receivers = new ArrayList<>();
        for (String recieverId : request.getRecipientIds()) {
            Account receiver = accountRepo.findByUserId(recieverId).orElseThrow(() -> new RuntimeException("Không tồn tại gười dùng có mã số " + recieverId));
            receivers.add(receiver);
        }
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

    public APIResponse<PaginationResponse<NotificationResponse>> getNotificationsForAccount(String userId, String page, String numberOfNotification) throws AppException {

        Account account = accountRepo.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfNotification));
        Page<NotificationReceiver> notificationReceivers = notificationReceiverRepo.findByReceiver_UserId(userId, pageable);

        List<NotificationResponse> notificationResponses = notificationReceivers.stream()
                .map(receiver -> {
                    Notification notification = receiver.getNotification();
                    return NotificationResponse.builder()
                            .notificationId(receiver.getId())
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .isRead(receiver.isRead())
                            .createdAt(notification.getCreatedAt())
                            .senderName(notification.getSender() != null ? notification.getSender().getName() : "Hệ thống")
                            .build();
                })
                .sorted(Comparator.comparing(NotificationResponse::getCreatedAt).reversed()) //lastest
                .toList();

        PaginationResponse<NotificationResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(notificationResponses);
        paginationResponse.setTotalElements(notificationReceivers.getTotalElements());
        paginationResponse.setTotalPages(notificationReceivers.getTotalPages());
        paginationResponse.setCurrentPage(notificationReceivers.getNumber());
        return APIResponse.<PaginationResponse<NotificationResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<Void> markNotificationAsRead(String notificationReceiverId) throws AppException {
        NotificationReceiver notificationReceiver = notificationReceiverRepo.findById(notificationReceiverId).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_RECEIVER_NOT_FOUND));
        notificationReceiver.setRead(true);
        notificationReceiverRepo.save(notificationReceiver);
        return APIResponse.<Void>builder()
                .code("200")
                .message("Successfully marked notification as read")
                .build();
    }

    public APIResponse<Void> sendNotificationtoAllStudents(NotificationRequest request) throws AppException, MessagingException {
        Account account = accountRepo.findByUserId(request.getSenderId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        int month = LocalDate.now().getMonth().getValue();
        Semester semester = month < 5 ? Semester.HK2 : month < 9 ? Semester.HK3 : Semester.HK1;
        String year = String.valueOf(LocalDate.now().getYear());

        List<Student> students = studentRepo.findGuidedStudentsByTeacherId(request.getSenderId(), semester, year);
        request.setRecipientIds(students.stream().map(student -> student.getUserId()).collect(Collectors.toList()));
        return createUserNotification(request);

    }

    public APIResponse<Void> sendToTeachersGroupByDepartment(NotificationRequest request) throws AppException, MessagingException {
        List<String> departmentIds = request.getRecipientIds();
        if (departmentIds.isEmpty()) {
            throw new RuntimeException("Không có mã khoa truyền vào");
        }
        List<Teacher> teachers = new ArrayList<>();
        for (String departmentId : departmentIds) {
            Department department = departmentRepo.findByDepartmentId(departmentId);
            if (department == null) {
                throw new RuntimeException("Không tồn tại khoa có mã số " + departmentId);
            } else {
                teachers.addAll(teacherRepo.findAllByDepartment(department));
            }
        }
        if (teachers.isEmpty()) {
            throw new RuntimeException("Không có giáo viên ưứng với mã khoa truyền vào");
        }
        request.setRecipientIds(teachers.stream().map(Teacher::getUserId).collect(Collectors.toList()));
        return createUserNotification(request);
    }

    public APIResponse<PaginationResponse<SentNotificationResponse>> getSentNotifications(String userId, String page, String numberOfNotification) {
        Account account = accountRepo.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfNotification));
        Page<Notification> notifications = notificationRepo.findBySender_UserId(userId, pageable);
        List<SentNotificationResponse> notificationResponses = notifications.stream()
                .map(notification -> {
                    List<NotificationReceiver> receivers = notification.getReceivers();
                    List<String> receiverNames = receivers.stream()
                            .map(receiver ->
                                    receiver.getReceiver().getName() + " - " + receiver.getReceiver().getUserId()
                            ).collect(Collectors.toList());
                    return SentNotificationResponse.builder()
                            .notificationId(notification.getId())
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .createdAt(notification.getCreatedAt())
                            .recipientNames(receiverNames)
                            .build();
                })
                .sorted(Comparator.comparing(SentNotificationResponse::getCreatedAt).reversed()) //lastest
                .toList();
        PaginationResponse<SentNotificationResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(notificationResponses);
        paginationResponse.setTotalElements(notifications.getTotalElements());
        paginationResponse.setTotalPages(notifications.getTotalPages());
        paginationResponse.setCurrentPage(notifications.getNumber());

        return APIResponse.<PaginationResponse<SentNotificationResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();

    }
}


