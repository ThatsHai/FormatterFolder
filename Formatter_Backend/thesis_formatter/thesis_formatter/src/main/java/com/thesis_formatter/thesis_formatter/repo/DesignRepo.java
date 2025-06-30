package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignRepo extends JpaRepository<Design, String> {
    Page<Design> findAllByForm_FormId(String formId, Pageable pageable);
}
