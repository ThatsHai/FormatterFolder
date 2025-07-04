package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TopicRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherTopicsResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TopicResponse;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.service.TopicService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class TopicController {
    TopicService topicService;

    @GetMapping("/topics")
    public APIResponse<List<Topic>> getTopics(@RequestParam(required = false) String formId) {
        if (formId == null)
            return topicService.getAll();
        else return topicService.getTopicByFormId(formId);
    }

    @PostMapping("/topics/create")
    public APIResponse<TopicResponse> createTopic(@RequestBody TopicRequest topic) {
        return topicService.create(topic);
    }

    @GetMapping("topics/teacher")
    public APIResponse<List<Topic>> getTeacherTopics(@RequestParam String teacherId) {
        return topicService.getTopicByTeacher_AcId(teacherId);
    }

    @GetMapping("topics/groupByTeacher")
    public APIResponse<PaginationResponse<TeacherTopicsResponse>> getTopicsGroupByTeacher() {
        return topicService.getTopicsGroupByTeacher();
    }
}
