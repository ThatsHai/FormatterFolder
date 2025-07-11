package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepo extends JpaRepository<Teacher, String>, JpaSpecificationExecutor<Teacher> {
    Teacher findByUserId(String userId);

    Teacher findByAcId(String acId);

    @Query("SELECT t FROM Teacher t WHERE t.department.departmentName = :departmentName " +
            "AND t.department.faculty.facultyName = :faculty AND t.name = :teacherName " +
            "AND t.userId= :teacherId")
    Teacher findTeachersByFilters(@Param("faculty") String faculty,
                                  @Param("departmentName") String departmentName,
                                  @Param("teacherId") String teacherId,
                                  @Param("teacherName") String teacherName);

    Page<Teacher> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

}
