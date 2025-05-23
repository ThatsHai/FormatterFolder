package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.ClassService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassController {

    ClassService classService;

    @PostMapping("/classes")
    public APIResponse<StudentClass> addClass(@RequestBody StudentClass studentClass) {
        return classService.addClass(studentClass);
    }

    @GetMapping("/classes")
    public APIResponse<List<StudentClass>> getAllDepartments() {
        return classService.getAll();
    }
}
