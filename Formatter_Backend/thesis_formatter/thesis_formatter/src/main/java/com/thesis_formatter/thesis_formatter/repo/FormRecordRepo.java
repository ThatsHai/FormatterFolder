package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormRecordRepo extends JpaRepository<FormRecord, String> {
    List<FormRecord> findByStudent_AcId(String id);
}
