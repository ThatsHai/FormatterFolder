package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import com.thesis_formatter.thesis_formatter.repo.FacultyRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacultyService {
    FacultyRepo facultyRepo;

    public APIResponse<Faculty> addFaculty(Faculty faculty) {
        facultyRepo.save(faculty);
        return APIResponse
                .<Faculty>builder()
                .code("200")
                .result(faculty)
                .build();
    }

    public APIResponse<List<Faculty>> getAll() {
        List<Faculty> faculties = facultyRepo.findAll();
        return APIResponse.<List<Faculty>>builder()
                .code("200")
                .result(faculties)
                .build();
    }
}
