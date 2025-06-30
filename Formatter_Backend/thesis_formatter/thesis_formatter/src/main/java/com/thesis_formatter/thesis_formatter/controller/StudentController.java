package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddStudentRequest;
import com.thesis_formatter.thesis_formatter.dto.request.StudentSearchCriteria;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.StudentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class StudentController {
    StudentService studentService;

    @PostMapping("/students")
    public APIResponse<StudentDTO> addStudent(@RequestBody AddStudentRequest request) {
        return studentService.addStudent(request);
    }

    @GetMapping("/students")
    public APIResponse<List<Student>> getStudents() {
        return studentService.getAll();
    }

    @PostMapping("/students/search")
    public APIResponse<PaginationResponse<StudentDTO>> getStudentsByCriteria(@RequestBody StudentSearchCriteria studentSearchCriteria, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return studentService.searchStudents(studentSearchCriteria, page, numberOfRecords);
    }
}
