package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.FacultyResponse;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
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
@CrossOrigin
public class FacultyController {
    FacultyService facultyService;

    @PostMapping("/faculties")
    public APIResponse<Faculty> addFaculty(@RequestBody Faculty faculty) {
        return facultyService.addFaculty(faculty);
    }

    @GetMapping("/faculties")
    public APIResponse<List<Faculty>> getFaculty() {
        return facultyService.getAll();
    }

//    @GetMapping("/faculties")
//    public APIResponse<List<FacultyResponse>> getFaculty() {
//        return facultyService.getAll();
//    }
}
