package com.thesis_formatter.thesis_formatter.dto.request;

import com.thesis_formatter.thesis_formatter.enums.Semester;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateTopicRequest {
    String topicId;
    String title;
    String description;
    String researchContent;
    String objective;
    String objectiveDetails;
    String funding;
    String time;
    String implementationTime;
    List<String> teacherIds;
    String contactInfo;
    List<String> majorIds;
    List<String> studentIds;
    String year;
    Semester semester;
}
