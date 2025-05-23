package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
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
}
