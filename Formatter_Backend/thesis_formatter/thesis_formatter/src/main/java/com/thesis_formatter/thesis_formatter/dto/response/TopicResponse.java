package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopicResponse {
    String topicId;
    String title;
    String description;
    String objective;
    String funding;
    String fundingSource;
    String implementationTime;
    List<TeacherDTO> teachers;
    String contactInfo;
    List<Major> majors;
    Form form;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Semester semester;
}
