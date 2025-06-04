package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.FacultyResponse;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.mapper.FacultyMapper;
import com.thesis_formatter.thesis_formatter.repo.FacultyRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
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
    private final FacultyMapper facultyMapper;

    public APIResponse<Faculty> addFaculty(Faculty faculty) {
        facultyRepo.save(faculty);
        return APIResponse
                .<Faculty>builder()
                .code("200")
                .result(faculty)
                .build();
    }

    public APIResponse<List<FacultyResponse>> getAll() {
        List<Faculty> faculties = facultyRepo.findAll();
        return APIResponse.<List<FacultyResponse>>builder()
                .code("200")
                .result(facultyMapper.toFacultyResponseList(faculties))
                .build();
    }
}
