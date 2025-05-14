package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.FacultyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacultyController {
    FacultyService facultyService;

    @PostMapping("/faculty")
    public APIResponse<Faculty> addFaculty(@RequestBody Faculty faculty) {
        return facultyService.addFaculty(faculty);
    }

    @GetMapping("/faculty")
    public APIResponse<List<Faculty>> getFaculty() {
        return facultyService.getAll();
    }
}
