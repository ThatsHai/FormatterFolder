package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeacherRepo extends JpaRepository<Teacher, String> {

//    @Query("SELECT t FROM Teacher t WHERE t.account.department.DP_name = :departmentName " +
//            "AND t.account.faculty.facultyName = :faculty AND t.account.name = :teacherName " +
//            "AND t.TC_id= :teacherId")
//    Teacher findTeachersByFilters(@Param("faculty") String faculty,
//                                  @Param("departmentName") String departmentName,
//                                  @Param("teacherId") String teacherId,
//                                  @Param("teacherName") String teacherName);
}
