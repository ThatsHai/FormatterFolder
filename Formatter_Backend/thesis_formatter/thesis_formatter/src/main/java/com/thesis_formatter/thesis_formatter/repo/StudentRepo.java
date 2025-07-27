package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, String>, JpaSpecificationExecutor<Student> {
    Student findByUserId(String studentId);

    List<Student> findByUserIdIn(List<String> userIds);

    Student findByAcId(String acId);

    boolean existsByUserId(String userId);

    @Query("select distinct s from Topic t join t.students s join t.teachers tc where tc.userId = :userId and t.status = com.thesis_formatter.thesis_formatter.enums.TopicStatus.PUBLISHED and t.semester = :semester and t.year = :year")
    List<Student> findGuidedStudentsByTeacherId(@Param("userId") String userId, @Param("semester") Semester semester, @Param("year") String year);
}
