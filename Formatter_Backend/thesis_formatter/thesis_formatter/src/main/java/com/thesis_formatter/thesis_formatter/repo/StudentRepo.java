package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, String>, JpaSpecificationExecutor<Student> {
    Student findByUserId(String studentId);

    List<Student> findByUserIdIn(List<String> userIds);

    Student findByAcId(String acId);

    boolean existsByUserId(String userId);

}
