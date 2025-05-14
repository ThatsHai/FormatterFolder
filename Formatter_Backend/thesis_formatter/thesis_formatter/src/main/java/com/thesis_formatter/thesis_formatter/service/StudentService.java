package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentService {
    StudentRepo studentRepo;

    public APIResponse<Student> addStudent(Student student) {
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
