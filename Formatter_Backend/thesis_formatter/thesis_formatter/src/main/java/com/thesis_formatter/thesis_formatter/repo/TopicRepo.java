package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepo extends JpaRepository<Topic, String> {
    List<Topic> findTopicsByForm_FormId(String formId);

    List<Topic> findTopicsByTeachers_AcId(String AcId);

    @Query("SELECT t2.userId, t2.name, t1 FROM Topic t1 JOIN t1.teachers t2 ORDER BY t2.userId")
    List<Object[]> findTopicsGroupedByUserIdAndName();
}
