package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherTopicLimitRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherTopicsResponse;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.service.TeacherTopicLimitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class TeacherTopicLimitController {
    TeacherTopicLimitService teacherTopicLimitService;

    @GetMapping("/teacherTopicLimit/getAll")
    public APIResponse<List<TeacherTopicLimit>> getAllTeacherTopicLimit() {
        return teacherTopicLimitService.getAll();
    }

//    @GetMapping("/teacherTopicLimit")
//    public APIResponse<String> getTeacherTopicLimit(@RequestParam String teacherId) {
//        return teacherTopicLimitService.getByTeacherId(teacherId);
//    }

    @PostMapping("/teacherTopicLimit")
    public APIResponse<TeacherTopicLimitRequest> createTeacherTopicLimit(@RequestBody TeacherTopicLimitRequest teacherTopicLimitRequest) {
        return teacherTopicLimitService.createTeacherTopicLimit(teacherTopicLimitRequest);
    }

}
