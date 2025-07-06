package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.service.TeacherTopicLimitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class TeacherTopicLimitController {
    TeacherTopicLimitService teacherTopicLimitService;

    @GetMapping("/teacherTopicLimit/getAll")
    public APIResponse<List<TeacherTopicLimit>> getAllTeacherTopicLimitController() {
        return teacherTopicLimitService.getAll();
    }

    
}
