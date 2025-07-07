package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
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
public class DepartmentService {
    DepartmentRepo departmentRepo;
    FacultyRepo facultyRepo;

    public APIResponse<Department> addDepartment(Department department) {
        Department departmentFinding = departmentRepo.findByDepartmentId(department.getDepartmentId());
        if (departmentFinding != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }
        Faculty faculty = facultyRepo.findByFacultyId(department.getFaculty().getFacultyId());
        department.setFaculty(faculty);
        departmentRepo.save(department);
        return APIResponse
                .<Department>builder()
                .result(department)
                .build();
    }

    public APIResponse<List<Department>> getAll() {
        List<Department> departments = departmentRepo.findAll();
        return APIResponse.<List<Department>>builder()
                .result(departments)
                .build();
    }

    public APIResponse<List<Department>> getDepartmentsByFacultyId(String facultyId) {
        List<Department> departments = departmentRepo.findByFacultyFacultyId(facultyId);
        return APIResponse.<List<Department>>builder()
                .code("200")
                .result(departments)
                .build();
    }

    public APIResponse<Faculty> getDepartmentParent(String departmentId) {
        Department department = departmentRepo.findById(departmentId)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        Faculty faculty = department.getFaculty();

        return APIResponse.<Faculty>builder()
                .code("200")
                .result(faculty)
                .build();
    }

    public APIResponse<List<Department>> getDepartmentById(String departmentId) {
        Department department = departmentRepo.findById(departmentId).orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
        return APIResponse.<List<Department>>builder()
                .code("200")
                .result(List.of(department))
                .build();

    }
}
