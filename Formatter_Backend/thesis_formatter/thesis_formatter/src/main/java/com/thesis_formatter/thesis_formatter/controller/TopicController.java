package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TopicRequest;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.service.TopicService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public APIResponse<List<TopicResponse>> getTopics(@RequestParam(required = false) String formId) {
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
    public APIResponse<PaginationResponse<TeacherTopicsResponse>> getTopicsGroupByTeacher(
            @RequestParam(name = "semester", required = false) String semester,
            @RequestParam String year,
            @RequestParam(name = "name", required = false) String teacherQueryName,
            @RequestParam String p,
            @RequestParam String n) {

        if (semester == null || semester.isBlank()) {
            return topicService.getTopicsGroupByTeacher(year, teacherQueryName, p, n);
        }
        return topicService.getTopicsGroupByTeacher(semester, year, teacherQueryName, p, n);
    }

    @GetMapping("topics/groupByTeacherWithLimit")
    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTopicsGroupByTeacherWithLimit(
            @RequestParam(name = "semester", required = false) String semester,
            @RequestParam String year,
            @RequestParam(name = "name", required = false) String teacherQueryName,
            @RequestParam String p,
            @RequestParam String n) {

        if (semester == null || semester.isBlank()) {
            return topicService.getTopicsGroupByTeacherWithLimit(year, teacherQueryName, p, n);
        }
        return topicService.getTopicsGroupByTeacherWithLimit(semester, year, teacherQueryName, p, n);
    }


}
