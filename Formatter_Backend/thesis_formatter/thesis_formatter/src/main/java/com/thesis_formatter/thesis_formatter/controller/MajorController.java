package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.service.MajorService;
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
public class MajorController {
    MajorService majorService;

    @PostMapping("/majors")
    public APIResponse<Major> addMajor(@RequestBody Major major) {
        return majorService.addMajor(major);
    }

    @GetMapping("/majors")
    public APIResponse<List<Major>> getMajors(@RequestParam(required = false) String deparmentId) {
        if (deparmentId == null) {
            System.out.println("deparmentId is null");
            return majorService.getAll();
        } else {
            return majorService.getMajorsByDepartmentId(deparmentId);
        }
    }

    @GetMapping("/majors/search")
    public APIResponse<List<Major>> getMajor(@RequestParam String name) {
        return majorService.getMajorsByName(name);
    }
}
