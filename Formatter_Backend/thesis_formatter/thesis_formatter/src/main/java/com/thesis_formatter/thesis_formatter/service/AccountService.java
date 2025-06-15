package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.mapper.StudentMapperImpl;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapperImpl;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountService {
    StudentMapperImpl studentMapperImpl;
    TeacherMapperImpl teacherMapperImpl;
    StudentRepo studentRepo;
    TeacherRepo teacherRepo;

    public APIResponse<?> getMyInfo(Authentication auth) {
        if (auth instanceof JwtAuthenticationToken jwtAuth) {

            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isStudent = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
            boolean isTeacher = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"));
            if (isAdmin) {
                Map<String, String> result = new LinkedHashMap<>();
                result.put("name", "ADMIN");
                result.put("username", "ADMIN");
                result.put("password", "ADMIN123");
                return APIResponse.builder().code("200").result(result).build();
            } else {
                String userId = jwtAuth.getName();
                if (isStudent) {
                    Student student = studentRepo.findByUserId(userId);
                    StudentDTO studentDTO = studentMapperImpl.toDTO(student);
                    return APIResponse.<StudentDTO>builder().code("200").result(studentDTO).build();
                } else if (isTeacher) {
                    Teacher teacher = teacherRepo.findByUserId(userId);
                    TeacherDTO teacherDTO = teacherMapperImpl.toDTO(teacher);
                    return APIResponse.<TeacherDTO>builder().code("200").result(teacherDTO).build();
                }
            }
        }
        return APIResponse.<String>builder().code("500").build();
    }
}

