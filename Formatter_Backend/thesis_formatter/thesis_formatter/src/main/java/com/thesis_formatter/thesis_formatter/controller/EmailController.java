package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.SendEmailRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class EmailController {
    EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail() {
        emailService.sendSimpleEmail("giaohuynh8a2@gmail.com", "HELLO WORLD 2", "Đây là email gửi từ Spring Boot");
        return ResponseEntity.ok("Email đã được gửi!");
    }

    @PostMapping("/group")
    public ResponseEntity<String> sendToGroup() {
        String[] to = {"giaob2103542@student.ctu.edu.vn"};
        String[] cc = {"haib2110122@student.ctu.edu.vn"};
        String[] bcc = new String[0];

        emailService.sendGroupEmail(
                "Thông báo hệ thống",
                "Đây là email gửi nhóm từ Spring Boot",
                to, cc, bcc
        );

        return ResponseEntity.ok("Gửi mail group thành công!");
    }

    @PostMapping("/sendHTML")
    public APIResponse<Void> sendHTML(@RequestBody SendEmailRequest request) throws MessagingException {
        return emailService.sendHtmlEmail(request);

    }
}
