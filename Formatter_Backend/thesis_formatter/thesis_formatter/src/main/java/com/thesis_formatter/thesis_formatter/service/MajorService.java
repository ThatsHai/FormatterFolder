package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.MajorRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MajorService {
    MajorRepo majorRepo;
    DepartmentRepo departmentRepo;

    public APIResponse<Major> addMajor(Major major) {
        Department department = departmentRepo.findByDepartmentId(major.getDepartment().getDepartmentId());

        major.setDepartment(department);
        majorRepo.save(major);
        return APIResponse
                .<Major>builder()
                .code("200")
                .result(major)
                .build();
    }

    public APIResponse<List<Major>> getAll() {
        List<Major> majors = majorRepo.findAll();
        return APIResponse.<List<Major>>builder()
                .code("200")
                .result(majors)
                .build();
    }

    public APIResponse<List<Major>> getMajorsByDepartmentId(String departmentId) {
        List<Major> majors = majorRepo.findByDepartment_DepartmentId(departmentId);
        return APIResponse.<List<Major>>builder()
                .code("200")
                .result(majors)
                .build();
    }
}
