package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.mapper.RoleMapper;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class TeacherService {
    TeacherRepo teacherRepo;
    DepartmentRepo departmentRepo;
    private final TeacherMapper teacherMapper;
    AuthenticationService authenticationService;
    RoleRepo roleRepo;

    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse<Teacher> addTeacher(Teacher teacher) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Authorities: " + authentication.getAuthorities());
        Department department = departmentRepo.findByDepartmentId(teacher.getDepartment().getDepartmentId());
        teacher.setDepartment(department);
        authenticationService.encodePassword(teacher);
        Role role = roleRepo.findByName("TEACHER");
        teacher.setRole(role);
        teacherRepo.save(teacher);
        return APIResponse
                .<Teacher>builder()
                .code("200")
                .result(teacher)
                .build();
    }

    public APIResponse<List<TeacherDTO>> getAll() {
        List<Teacher> teachers = teacherRepo.findAll();
        List<TeacherDTO> teacherDTOs = new ArrayList<>();
        for (Teacher teacher : teachers) {
            TeacherDTO dto = teacherMapper.toDTO(teacher);
            teacherDTOs.add(dto);
        }
        return APIResponse.<List<TeacherDTO>>builder()
                .code("200")
                .result(teacherDTOs)
                .build();
    }

    public ResponseEntity<?> findTeacherByFilters(TeacherFiltersDTO teacherFiltersDTO) {
        try {
            String faculty = teacherFiltersDTO.faculty();
            String departmentName = teacherFiltersDTO.departmentName();
            String teacherName = teacherFiltersDTO.teacherName();
            String teacherId = teacherFiltersDTO.teacherId();
            Teacher teacher = teacherRepo.findTeachersByFilters(faculty, departmentName, teacherId, teacherName);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy giảng viên phù hợp");
            }
            TeacherFiltersReponseDTO teacherFiltersReponseDTO = convertTeacherToTeacherFiltersReponseDTO(teacher);
            return ResponseEntity.status(HttpStatus.OK).body(teacherFiltersReponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    private TeacherFiltersReponseDTO convertTeacherToTeacherFiltersReponseDTO(Teacher teacher) {
        return new TeacherFiltersReponseDTO(
                teacher.getUserId(),
                teacher.getName()
        );
    }
}
