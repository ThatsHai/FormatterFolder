package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.request.TeacherSearchCriteria;
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
@CrossOrigin
public class TeacherController {


    TeacherService teacherService;

    @PostMapping("/teachers")
    public APIResponse<TeacherDTO> addTeacher(@RequestBody Teacher teacher) {
        return teacherService.addTeacher(teacher);
    }

    @GetMapping("/teachers")
    public APIResponse<List<TeacherDTO>> getTeachers(@RequestParam(required = false) String departmentId,
                                                     @RequestParam(required = false) String facultyId,
                                                     @RequestParam(required = false) String userId,
                                                     @RequestParam(required = false) String name) {
//        if (userId != null) {
//            return teacherService.getTeacherByUserId(userId);
//        } else if (name != null) {
//            return teacherService.getTeachersByName(name);
//        } else if (departmentId != null) {
//            return teacherService.getTeachersByDepartmentId(departmentId);
//        } else if (facultyId != null) {
//            return teacherService.getTeachersByFacultyId(facultyId);
//        }
        return teacherService.getAll();
    }

    @PostMapping("/teachers/search")
    public APIResponse<List<TeacherDTO>> getTeachersByCriteria(@RequestBody TeacherSearchCriteria teacherSearchCriteria) {
        return teacherService.searchTeachers(teacherSearchCriteria);
    }

    @GetMapping("teachers/getTeacherByFilters")
    public ResponseEntity<?> getTeacherById(@RequestBody TeacherFiltersDTO teacherFiltersDTO) {
        return teacherService.findTeacherByFilters(teacherFiltersDTO);
    }

}
