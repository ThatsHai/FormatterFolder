package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.DepartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentController {

    DepartmentService departmentService;

    @PostMapping("/departments")
    public APIResponse<Department> addDepartment(@RequestBody Department department) {
        return departmentService.addDepartment(department);
    }

    @GetMapping("/departments")
    public APIResponse<List<Department>> getAllDepartments() {
        return departmentService.getAll();
    }
}
