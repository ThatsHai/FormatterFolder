package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.request.TeacherSearchCriteria;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.mapper.RoleMapper;
import com.thesis_formatter.thesis_formatter.entity.TeacherSpecification;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.entity.Role;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.RoleRepo;
import com.thesis_formatter.thesis_formatter.repo.FacultyRepo;
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

import java.util.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class TeacherService {
    TeacherRepo teacherRepo;
    DepartmentRepo departmentRepo;
    TeacherMapper teacherMapper;
    AuthenticationService authenticationService;
    RoleRepo roleRepo;
//    private final FacultyRepo facultyRepo;

    private final FacultyRepo facultyRepo;
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse<TeacherDTO> addTeacher(Teacher teacher) {

        Department department = departmentRepo.findByDepartmentId(teacher.getDepartment().getDepartmentId());
        teacher.setDepartment(department);
        authenticationService.encodePassword(teacher);
        Role role = roleRepo.findByName("TEACHER");
        teacher.setRole(role);
        teacherRepo.save(teacher);

        TeacherDTO teacherDTO = teacherMapper.toDTO(teacher);
        return APIResponse
                .<TeacherDTO>builder()
                .code("200")
                .result(teacherDTO)
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

    public APIResponse<List<TeacherDTO>> getAll() {
        List<Teacher> teachers = teacherRepo.findAll();
        return buildTeacherResponse(teachers);
    }

    //    public APIResponse<List<TeacherDTO>> getTeachersByDepartmentId(String departmentId) {
//        Department department = departmentRepo.findByDepartmentId(departmentId);
//        if (department == null) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        List<Teacher> teachers = teacherRepo.findByDepartmentDepartmentId(departmentId);
//        return buildTeacherResponse(teachers);
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeachersByFacultyId(String facultyId) {
//        Faculty faculty = facultyRepo.findByFacultyId(facultyId);
//        if (faculty == null) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        //No departments
//        List<Department> departments = departmentRepo.findByFacultyFacultyId(facultyId);
//        if (departments.isEmpty()) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("200")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        List<Teacher> teachers = teacherRepo.findByDepartmentIn(departments);
//        return buildTeacherResponse(teachers);
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeacherByUserId(String userId) {
//        Optional<Teacher> teacherOptional = teacherRepo.findByUserId(userId);
//
//        if (teacherOptional.isPresent()) {
//            TeacherDTO dto = teacherMapper.toDTO(teacherOptional.get());
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("200")
//                    .result(Collections.singletonList(dto))
//                    .build();
//        } else {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeachersByName(String name) {
//        List<Teacher> teachers = teacherRepo.findByNameContainingIgnoreCase(name);
//        return buildTeacherResponse(teachers);
//    }
//
    private APIResponse<List<TeacherDTO>> buildTeacherResponse(List<Teacher> teachers) {
        List<TeacherDTO> teacherDTOs = teachers.stream()
                .map(teacherMapper::toDTO)
                .collect(Collectors.toList());

        return APIResponse.<List<TeacherDTO>>builder()
                .code("200")
                .result(teacherDTOs)
                .build();
    }

    public APIResponse<List<TeacherDTO>> searchTeachers(TeacherSearchCriteria criteria) {
        List<Teacher> teachers = teacherRepo.findAll(TeacherSpecification.withCriteria(criteria));
        return buildTeacherResponse(teachers);
    }


}
