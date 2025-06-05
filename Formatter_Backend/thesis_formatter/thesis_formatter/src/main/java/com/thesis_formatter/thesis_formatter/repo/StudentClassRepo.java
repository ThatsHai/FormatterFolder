package com.thesis_formatter.thesis_formatter.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;

import java.util.List;

@Repository
public interface StudentClassRepo extends JpaRepository<StudentClass, String> {
    StudentClass findByStudentClassId(String classId);

    List<StudentClass> findByMajor_MajorId(String majorId);

}
