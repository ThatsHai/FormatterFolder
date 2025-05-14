package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
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
    public APIResponse<Department> addDepartment(Department department) {
        departmentRepo.save(department);
        return APIResponse
                .<Department>builder()
                .code("200")
                .result(department)
                .build();
    }

    public APIResponse<List<Department>> getAll() {
        List<Department> departments = departmentRepo.findAll();
        return APIResponse.<List<Department>>builder()
                .code("200")
                .result(departments)
                .build();
    }
}
