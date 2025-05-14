package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.repo.DepartmentRepo;
import com.thesis_formatter.thesis_formatter.repo.FacultyRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherService {
    TeacherRepo teacherRepo;
    FacultyRepo facultyRepo;
    DepartmentRepo departmentRepo;

    public APIResponse<Teacher> addTeacher(Teacher teacher) {
        Faculty faculty = facultyRepo.findByFacultyId(teacher.getFaculty().getFacultyId());
        Department department = departmentRepo.findByDepartmentId(teacher.getDepartment().getDepartmentId());
        teacher.setDepartment(department);
        teacher.setFaculty(faculty);
        teacherRepo.save(teacher);
        return APIResponse
                .<Teacher>builder()
                .code("200")
                .result(teacher)
                .build();
    }

    public APIResponse<List<Teacher>> getAll() {
        List<Teacher> teachers = teacherRepo.findAll();
        return APIResponse.<List<Teacher>>builder()
                .code("200")
                .result(teachers)
                .build();
    }

    public ResponseEntity<?> findTeacherByFilters(TeacherFiltersDTO teacherFiltersDTO) {
        try{
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
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    private TeacherFiltersReponseDTO convertTeacherToTeacherFiltersReponseDTO(Teacher teacher) {
        return new TeacherFiltersReponseDTO(
                teacher.getTcId(),
                teacher.getName()
        );
    }
}
