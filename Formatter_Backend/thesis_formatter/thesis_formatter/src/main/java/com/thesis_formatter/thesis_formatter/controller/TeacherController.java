package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.TeacherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherController {


    TeacherService teacherService;

    @PostMapping("/teachers")
    public APIResponse<Teacher> addTeacher(@RequestBody Teacher teacher) {
        return teacherService.addTeacher(teacher);
    }

    @GetMapping("/teachers")
    public APIResponse<List<TeacherDTO>> getTeachers() {
        return teacherService.getAll();
    }

    @GetMapping("teachers/getTeacherByFilters")
    public ResponseEntity<?> getTeacherById(@RequestBody TeacherFiltersDTO teacherFiltersDTO) {
        return teacherService.findTeacherByFilters(teacherFiltersDTO);
    }
}
