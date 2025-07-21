package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.SendEmailRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Year;
import java.util.Locale;
import java.util.regex.Pattern;

@Service

public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public static String generateStudentEmail(String name, String userId) {

        String parts[] = name.split("\\s+");
        String lastName = parts[parts.length - 1];

        //  chuyển tên thành không dấu và viết liền
        String baseName = removeAccents(lastName).toLowerCase();

        return baseName + userId + "@student.ctu.edu.vn";
    }

    private static String removeAccents(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("");
    }

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("Email sent successfully to " + toEmail);
    }

    public void sendGroupEmail(String subject, String body, String[] toEmails, String[] ccEmails, String[] bccEmails) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(subject);
        message.setText(body);

        if (toEmails != null && toEmails.length > 0) {
            message.setTo(toEmails);
        }
        if (ccEmails != null && ccEmails.length > 0) {
            message.setCc(ccEmails);
        }
        if (bccEmails != null && bccEmails.length > 0) {
            message.setBcc(bccEmails);
        }
        mailSender.send(message);
    }

    public APIResponse<Void> sendHtmlEmail(SendEmailRequest request) throws MessagingException {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (request.getToEmails() != null) helper.setTo(request.getToEmails());
            if (request.getCcEmails() != null) helper.setCc(request.getBccEmails());
            if (request.getBccEmails() != null) helper.setBcc(request.getBccEmails());
            helper.setSubject("Thông báo mới: " + request.getSubject());
            helper.setText(generateHtmlContent(request.getSender(), request.getMessage(), request.getActionUrl(), request.getActionText()), true); // true = isHtml

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage(), e);
        }

        return APIResponse.<Void>builder()
                .code("200")
                .message("Gửi email thành công!")
                .build();
    }

    private String generateHtmlContent(String sender, String message, String actionUrl, String actionText) {
        return """
                                <html>
                                  <body style="margin:0; padding:20px; background-color:#f4f4f4; font-family:Arial, sans-serif;">
                                    <div style="max-width:1000px; margin:30px auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                                      <div style="background-color:#007bff; padding:20px 30px;">
                                        <h1 style="margin:0; color:#ffffff; font-size:24px;">Thông báo từ %s</h1>
                                      </div>
                                      <div style="padding:30px;">
                                        <p style="font-size:16px; color:#555; line-height:1.6;">%s</p>
                                        %s
                                        <p style="font-size:14px; color:#999; margin-top:40px;">Trân trọng,<br>Đội ngũ Hỗ trợ</p>
                                      </div>
                                    </div>
                                    <div style="text-align:center; font-size:12px; color:#aaa; margin-top:20px;">
                                      <p>© %d Hệ thống hỗ trợ luận văn - Mọi quyền được bảo lưu.</p>
                                    </div>
                                  </body>
                                </html>
                """.formatted(sender,
//                recipientName,
                message,
                (actionUrl != null && actionText != null)
                        ? """
                          <div style="margin:30px 0; text-align:center;">
                            <a href="%s" style="background-color:#007bff; color:#fff; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:5px;">%s</a>
                          </div>
                        """.formatted(actionUrl, actionText)
                        : "",
                java.time.Year.now().getValue()
        );
    }


}
