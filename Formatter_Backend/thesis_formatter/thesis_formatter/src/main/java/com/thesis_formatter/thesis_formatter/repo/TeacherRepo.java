package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepo extends JpaRepository<Teacher, String> {

    @Query("SELECT t FROM Teacher t WHERE t.department.departmentName = :departmentName " +
            "AND t.faculty.facultyName = :faculty AND t.name = :teacherName " +
            "AND t.tcId= :teacherId")
    Teacher findTeachersByFilters(@Param("faculty") String faculty,
                                  @Param("departmentName") String departmentName,
                                  @Param("teacherId") String teacherId,
                                  @Param("teacherName") String teacherName);
    Teacher findByTcId(String teacherId);
}
