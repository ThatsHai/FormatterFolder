package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherFormRecordResponse {
    String userId;
    String teacherName;
    List<FormRecordScheduleResponse> formRecordSchedules;
}
