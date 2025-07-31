package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SentNotificationResponse {
    String notificationId;
    String title;
    String message;
    LocalDateTime createdAt;
    List<String> recipientNames;
}
