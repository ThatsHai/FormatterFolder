package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.StudentClassService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class StudentClassController {

    StudentClassService studentClassService;

    @PostMapping("/classes")
    public APIResponse<StudentClass> addClass(@RequestBody StudentClass studentClass) {
        return studentClassService.addClass(studentClass);
    }

    @GetMapping("/classes")
    public APIResponse<List<StudentClass>> getAllClasses(@RequestParam(required = false) String majorId) {
        if (majorId != null) {
            System.out.println("majorId: " + majorId);
            return studentClassService.getClassByMajorId(majorId);

        }
        return studentClassService.getAll();
    }
}
