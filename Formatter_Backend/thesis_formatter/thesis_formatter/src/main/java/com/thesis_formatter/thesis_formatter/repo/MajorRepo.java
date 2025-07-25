package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MajorRepo extends JpaRepository<Major, String> {
    Major findByMajorId(String majorId);
    List<Major> findByMajorIdIn(List<String> majorIds);

    List<Major> findByDepartment_DepartmentId(String departmentId);

    List<Major> findByMajorNameContainingIgnoreCase(String name);

}