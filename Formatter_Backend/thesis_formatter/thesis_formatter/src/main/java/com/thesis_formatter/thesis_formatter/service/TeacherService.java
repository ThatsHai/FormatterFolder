package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherFiltersReponseDTO;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherService {
    TeacherRepo teacherRepo;

    public ResponseEntity<?> findTeacherByFilters(TeacherFiltersDTO teacherFiltersDTO) {
        try{
            String faculty = teacherFiltersDTO.faculty();
            String departmentName = teacherFiltersDTO.departmentName();
            String teacherName = teacherFiltersDTO.teacherName();
            String teacherId = teacherFiltersDTO.teacherId();
            Teacher teacher = teacherRepo.findTeachersByFilters(faculty, departmentName, teacherId, teacherName);
            System.out.println("QUERY: " + faculty + ", " + departmentName + ", " + teacherId + ", " + teacherName);
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
                teacher.getTC_id(),
                teacher.getAccount().getName()
        );
    }
}
