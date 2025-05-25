package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.enums.Role;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherService {
    TeacherRepo teacherRepo;
    DepartmentRepo departmentRepo;
    TeacherMapper teacherMapper;
    AuthenticationService authenticationService;

    public APIResponse<TeacherDTO> addTeacher(Teacher teacher) {
        Department department = departmentRepo.findByDepartmentId(teacher.getDepartment().getDepartmentId());
        teacher.setDepartment(department);
        authenticationService.encodePassword(teacher);
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        teacher.setRoles(roles);
        teacherRepo.save(teacher);

        TeacherDTO teacherDTO = teacherMapper.toDTO(teacher);
        return APIResponse
                .<TeacherDTO>builder()
                .code("200")
                .result(teacherDTO)
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
