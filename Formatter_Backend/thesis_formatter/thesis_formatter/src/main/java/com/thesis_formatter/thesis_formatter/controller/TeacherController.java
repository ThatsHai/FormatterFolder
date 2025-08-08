package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.request.TeacherSearchCriteria;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.Account;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.service.TeacherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public APIResponse<PaginationResponse<TeacherDTO>> getTeachersByCriteria(@RequestBody TeacherSearchCriteria teacherSearchCriteria, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return teacherService.searchTeachers(teacherSearchCriteria, page, numberOfRecords);
    }

    @GetMapping("teachers/getTeacherByFilters")
    public ResponseEntity<?> getTeacherById(@RequestBody TeacherFiltersDTO teacherFiltersDTO) {
        return teacherService.findTeacherByFilters(teacherFiltersDTO);
    }

    @GetMapping("/teachers/withTopicsAndLimits")
    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTeachersWithTopicsAndLimits(
            @RequestParam(required = false) String semester,
            @RequestParam String year,
            @RequestParam(name = "name", required = false) String teacherQueryName,
            @RequestParam String p,
            @RequestParam String n) {
        if (semester != null && !semester.isBlank()) {
            return teacherService.getTeachersWithTopicsAndLimits(semester, year, teacherQueryName, p, n);
        } else return teacherService.getTeachersWithTopicsAndLimits(year, teacherQueryName, p, n);
    }

    @PostMapping("/teachers/getListId")
    public APIResponse<List<TeacherDTO>> getListTeachersByIds(@RequestBody List<String> teacherIds) {
        return teacherService.getListTeachersByIds(teacherIds);
    }
}
