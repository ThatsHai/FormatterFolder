package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.enums.Role;
import com.thesis_formatter.thesis_formatter.mapper.StudentMapper;
import com.thesis_formatter.thesis_formatter.repo.ClassRepo;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
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
    ClassRepo classRepo;
    StudentMapper studentMapper;
    AuthenticationService authenticationService;

    public APIResponse<StudentDTO> addStudent(Student student) {
        StudentClass studentClass = classRepo.findById(student.getStudentClass().getStudentClassId()).orElse(null);
//        HashSet<String> roles = new HashSet<>();
//        roles.add(Role.USER.name());
////        student.setRoles(roles);
//        student.setStudentClass(studentClass);
        authenticationService.encodePassword(student);
        studentRepo.save(student);
        StudentDTO studentDTO = studentMapper.toDTO(student);
        return APIResponse
                .<StudentDTO>builder()
                .code("200")
                .result(studentDTO)
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
