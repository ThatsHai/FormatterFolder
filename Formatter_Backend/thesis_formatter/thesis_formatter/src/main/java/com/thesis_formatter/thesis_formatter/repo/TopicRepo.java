package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepo extends JpaRepository<Topic, String> {
    List<Topic> findTopicsByForm_FormId(String formId);

    List<Topic> findTopicsByTeachers_AcId(String AcId);

    @Query("SELECT t2.userId, t2.name, t1 " +
            "FROM Topic t1 " +
            "JOIN t1.teachers t2 " +
            "WHERE t1.semester = :semester " +
            "AND t1.year = :year " +
            "AND (:name IS NULL OR LOWER(t2.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "ORDER BY t2.userId")
    List<Object[]> findTopicsGroupedByUserIdAndName(@Param("semester") Semester semester,
                                                    @Param("year") String year,
                                                    @Param("name") String name);

    @Query("SELECT t2.userId, t2.name, t1 " +
            "FROM Topic t1 " +
            "JOIN t1.teachers t2 " +
            "WHERE t1.year = :year " +
            "AND (:name IS NULL OR LOWER(t2.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "ORDER BY t2.userId")
    List<Object[]> findTopicsGroupedByUserIdAndName(@Param("year") String year,
                                                    @Param("name") String name);

}
