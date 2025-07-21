package com.thesis_formatter.thesis_formatter.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendEmailRequest {
    String sender;
    String[] toEmails;
    String[] ccEmails;
    String[] bccEmails;
    String subject;
    String message;
    String actionUrl;
    String actionText;
}
