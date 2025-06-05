package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddStudentRequest;
import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.enums.EducationLevel;
import com.thesis_formatter.thesis_formatter.mapper.StudentMapper;
import com.thesis_formatter.thesis_formatter.repo.StudentClassRepo;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentService {
    StudentRepo studentRepo;

    DepartmentRepo departmentRepo;
    StudentClassRepo studentClassRepo;

    AuthenticationService authenticationService;
    RoleRepo roleRepo;
    private final StudentMapper studentMapper;

    //    public APIResponse<StudentDTO> addStudent(Student student) {
//        StudentClass studentClass = studentClassRepo.findById(student.getStudentClass().getStudentClassId()).orElse(null);
//        Role role = roleRepo.findByName("STUDENT");
//        student.setRole(role);
//        student.setStudentClass(studentClass);
//        authenticationService.encodePassword(student);
//        studentRepo.save(student);
//        StudentDTO studentDTO = studentMapper.toDTO(student);
//        return APIResponse
//                .<StudentDTO>builder()
//                .code("200")
//                .result(studentDTO)
//                .build();
//    }
    public APIResponse<StudentDTO> addStudent(AddStudentRequest studentRequest) {
        Student student = studentMapper.toStudent(studentRequest);
        StudentClass studentClass = studentClassRepo.findByStudentClassId(studentRequest.getClassId());
        Role role = roleRepo.findByName("STUDENT");

        student.setRole(role);
        student.setStudentClass(studentClass);
        student.setAvatar("https://icon-icons.com/icon/avatar-default-user/92824");
        student.setEducationLevel(EducationLevel.UNDERGRADUATE);

        String email = EmailService.generateStudentEmail(student.getName(),student.getUserId());
        student.setEmail(email);
        student.setStatus("ACTIVE");
        authenticationService.encodePassword(student);
        studentRepo.save(student);
        System.out.println(studentRequest.getClassId());
        System.out.println(studentClass);
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
