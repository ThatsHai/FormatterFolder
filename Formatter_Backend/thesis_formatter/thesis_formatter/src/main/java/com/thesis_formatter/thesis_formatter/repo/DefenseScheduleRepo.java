package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.DefenseSchedule;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DefenseScheduleRepo extends JpaRepository<DefenseSchedule, String> {
    DefenseSchedule findDefenseScheduleByFormRecord_FormRecordId(String formRecordId);

    List<DefenseSchedule> findByFormRecord_Topic_SemesterAndFormRecord_Topic_Year(Semester semester, String year);
}
