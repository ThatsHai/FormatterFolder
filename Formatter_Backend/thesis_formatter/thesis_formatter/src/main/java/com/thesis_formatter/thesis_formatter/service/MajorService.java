package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
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
        Major majorFinding = majorRepo.findByMajorId(major.getMajorId());
        if (majorFinding != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }
        Department department = departmentRepo.findByDepartmentId(major.getDepartment().getDepartmentId());
        if (department == null) {
            throw new AppException(ErrorCode.DEPARTMENT_NOT_FOUND);
        }
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

    public APIResponse<List<Major>> getMajorsByName(String name) {
        List<Major> majors = majorRepo.findByMajorNameContainingIgnoreCase(name);
        return APIResponse.<List<Major>>builder()
                .code("200")
                .result(majors)
                .build();
    }

    public APIResponse<List<Major>> getMajorById(String majorId) {
        Major major = majorRepo.findById(majorId).orElse(null);

        if (major == null) {
            return APIResponse.<List<Major>>builder()
                    .code("404")
                    .result(List.of())
                    .build();
        }

        return APIResponse.<List<Major>>builder()
                .code("200")
                .result(List.of(major))
                .build();
    }

    public APIResponse<Department> getMajorParent(String majorId) {
        Major major = majorRepo.findById(majorId)
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_EXISTED));

        Department department = major.getDepartment();

        return APIResponse.<Department>builder()
                .code("200")
                .result(department)
                .build();
    }

    public APIResponse<Major> updateMajor(Major major) {
        Major existedMajor = majorRepo.findByMajorId(major.getMajorId());
        if (existedMajor == null) {
            throw new AppException(ErrorCode.MAJOR_NOT_EXISTED);
        }
        Department department = departmentRepo.findByDepartmentId(major.getDepartment().getDepartmentId());
        if (department == null) {
            throw new AppException(ErrorCode.DEPARTMENT_NOT_FOUND);
        }
        existedMajor.setDepartment(department);
        existedMajor.setMajorName(major.getMajorName());
        existedMajor.setAvailability(major.getAvailability());
        majorRepo.save(existedMajor);
        return APIResponse.<Major>builder()
                .code("200")
                .result(existedMajor)
                .build();
    }
}
