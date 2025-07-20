package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.RestoredVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestoredVersionRepo extends JpaRepository<RestoredVersion, String> {
    List<RestoredVersion> findByFormRecord_FormRecordId(String formRecordId);
    void deleteByFormRecord_FormRecordId(String formRecordId);
}
