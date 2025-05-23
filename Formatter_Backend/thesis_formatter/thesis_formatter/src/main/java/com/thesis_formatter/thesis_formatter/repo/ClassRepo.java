package com.thesis_formatter.thesis_formatter.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;

@Repository
public interface ClassRepo extends JpaRepository<StudentClass, String> {
}
