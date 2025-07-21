package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddStudentRequest;
import com.thesis_formatter.thesis_formatter.dto.request.StudentSearchCriteria;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.entity.StudentSpecification;
import com.thesis_formatter.thesis_formatter.enums.EducationLevel;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.StudentMapper;
import com.thesis_formatter.thesis_formatter.repo.StudentClassRepo;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

        String email = EmailService.generateStudentEmail(student.getName(), student.getUserId());
        student.setEmail(email);
        student.setStatus("ACTIVE");
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

    public APIResponse<?> getById(String userId) {
        Student student = studentRepo.findByUserId(userId);
        if (student == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        StudentDTO studentDTO = studentMapper.toDTO(student);
        return APIResponse.builder()
                .code("200").result(studentDTO)
                .build();

    }

    public APIResponse<PaginationResponse<StudentDTO>> searchStudents(StudentSearchCriteria studentSearchCriteria, String page, String numberOfRecords) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfRecords));
        Page<Student> studentPage = studentRepo.findAll(StudentSpecification.withCriteria(studentSearchCriteria), pageable);
        List<StudentDTO> studentDTOList = studentPage.getContent()
                .stream()
                .map(studentMapper::toDTO)
                .toList();

        PaginationResponse<StudentDTO> pageResponse = new PaginationResponse<>();
        pageResponse.setCurrentPage(studentPage.getNumber());
        pageResponse.setContent(studentDTOList);
        pageResponse.setTotalElements(studentPage.getTotalElements());
        pageResponse.setTotalPages(studentPage.getTotalPages());

        return APIResponse.<PaginationResponse<StudentDTO>>builder()
                .code("200")
                .result(pageResponse)
                .build();
    }
}
