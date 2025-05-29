package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.repo.ClassRepo;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentService {
    StudentRepo studentRepo;

    DepartmentRepo departmentRepo;
    ClassRepo classRepo;

    AuthenticationService authenticationService;
    RoleRepo roleRepo;

    public APIResponse<Student> addStudent(Student student) {
        StudentClass studentClass = classRepo.findById(student.getStudentClass().getStudentClassId()).orElse(null);
        Role role = roleRepo.findByName("STUDENT");
        student.setRole(role);
        student.setStudentClass(studentClass);
        authenticationService.encodePassword(student);
        studentRepo.save(student);
        return APIResponse
                .<Student>builder()
                .code("200")
                .result(student)
                .build();
    }

    public APIResponse<List<Student>> getAll() {
        List<Student> students = studentRepo.findAll();
        return APIResponse.<List<Student>>builder()
                .code("200")
                .result(students)
                .build();
    }
}
