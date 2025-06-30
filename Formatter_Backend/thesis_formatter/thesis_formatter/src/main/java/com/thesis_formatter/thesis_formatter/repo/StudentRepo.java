package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends JpaRepository<Student, String> {
    Student findByUserId(String studentId);
    Student findByAcId(String acId);
}
