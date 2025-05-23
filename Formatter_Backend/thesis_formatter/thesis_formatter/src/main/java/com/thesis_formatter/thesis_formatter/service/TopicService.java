package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.repo.TopicRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TopicService {
    TopicRepo topicRepo;
    TeacherRepo teacherRepo;

    public APIResponse<List<Topic>> getAll() {
        List<Topic> topics = topicRepo.findAll();
        return APIResponse.<List<Topic>>builder()
                .code("200")
                .result(topics)
                .build();
    }

    public APIResponse<Topic> create(Topic topic) {
        if (topic.getTeacher() == null || topic.getTeacher().getAcId() == null) {
            throw new IllegalArgumentException("Teacher ID must be provided");
        }

        Teacher teacher = teacherRepo.findById(topic.getTeacher().getAcId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        topic.setTeacher(teacher);
        Topic savedTopic = topicRepo.save(topic);
        return APIResponse.<Topic>builder()
                .code("200")
                .result(savedTopic)
                .build();
    }

}
