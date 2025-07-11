package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherTopicWithLimitResponse {
    String userId;
    String name;
    int maxTopics;
    List<TopicResponse> topicResponses;
}
