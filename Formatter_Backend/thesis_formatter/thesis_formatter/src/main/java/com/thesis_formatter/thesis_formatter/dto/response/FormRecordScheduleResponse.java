package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FormRecordScheduleResponse {
    String formRecordId;
    String studentId;
    String studentName;
    String topicName;
}
