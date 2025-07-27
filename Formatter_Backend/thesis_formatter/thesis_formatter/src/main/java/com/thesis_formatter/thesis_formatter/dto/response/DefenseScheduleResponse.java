package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DefenseScheduleResponse {
    String stt;
    String studentId;
    String studentName;
    String topicName;
    List<String> guideNames;
    LocalDateTime startTime;
    String place;
    List<String> teacherNames;
}
