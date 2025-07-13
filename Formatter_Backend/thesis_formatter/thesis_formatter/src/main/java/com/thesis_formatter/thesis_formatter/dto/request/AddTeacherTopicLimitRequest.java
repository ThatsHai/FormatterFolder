package com.thesis_formatter.thesis_formatter.dto.request;

import com.thesis_formatter.thesis_formatter.enums.Semester;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddTeacherTopicLimitRequest {
    String userId;
    int maxTopics;
    @Enumerated(EnumType.STRING)
    Semester semester;
    String schoolYear;
}
