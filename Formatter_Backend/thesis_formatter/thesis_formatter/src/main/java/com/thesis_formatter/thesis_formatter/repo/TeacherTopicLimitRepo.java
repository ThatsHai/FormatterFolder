package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherTopicLimitRepo extends JpaRepository<TeacherTopicLimit, TeacherTopicLimitId> {
    List<TeacherTopicLimit> findAllById_TeacherIdAndId_SchoolYear(String teacherId, String schoolYear);
}
