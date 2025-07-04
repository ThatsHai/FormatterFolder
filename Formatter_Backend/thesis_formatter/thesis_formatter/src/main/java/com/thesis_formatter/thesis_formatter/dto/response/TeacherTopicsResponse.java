package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.Topic;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherTopicsResponse {
    private String userId;
    private String name;
    private List<TopicResponse> topicResponses;
}