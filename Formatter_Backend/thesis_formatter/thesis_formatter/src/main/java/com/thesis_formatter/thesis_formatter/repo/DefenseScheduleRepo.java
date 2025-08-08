package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.DefenseSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefenseScheduleRepo extends JpaRepository<DefenseSchedule, String> {
    DefenseSchedule findDefenseScheduleByFormRecord_FormRecordId(String formRecordId);
}
