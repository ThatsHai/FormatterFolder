package com.thesis_formatter.thesis_formatter.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SchedulePDFRequest {
    String stt;
    String studentId;
    String studentName;
    String topicName;
    List<String> guideNames;
    String startTime;
    String place;
    List<String> teacherNames;
}
