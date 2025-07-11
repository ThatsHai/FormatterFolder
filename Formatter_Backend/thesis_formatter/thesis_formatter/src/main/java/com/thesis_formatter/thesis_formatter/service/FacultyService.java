package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.FacultyResponse;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
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

    public APIResponse<Faculty> addFaculty(Faculty faculty) {
        Faculty facultyFinding = facultyRepo.findByFacultyId(faculty.getFacultyId());
        if (facultyFinding != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }
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

    public APIResponse<List<Faculty>> getFacultyById(String facultyId) {
        Faculty faculty = facultyRepo.findByFacultyId(facultyId);
        if (faculty == null) {
            throw new AppException(ErrorCode.FACULTY_NOT_FOUND);
        }
        return APIResponse.<List<Faculty>>builder()
                .result(List.of(faculty))
                .code("200")
                .build();
    }

//    public APIResponse<List<FacultyResponse>> getAll() {
//        List<Faculty> faculties = facultyRepo.findAll();
//        return APIResponse.<List<FacultyResponse>>builder()
//                .code("200")
//                .result(facultyMapper.toFacultyResponseList(faculties))
//                .build();
//    }
}
