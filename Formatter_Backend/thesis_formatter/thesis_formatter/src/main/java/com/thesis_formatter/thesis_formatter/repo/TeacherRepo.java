package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TeacherRepo extends JpaRepository<Teacher, String> {
    Teacher findTeachersByTC_id (String tc_id);
    @Query(value = "SELECT a.name FROM Account a WHERE ")
}
