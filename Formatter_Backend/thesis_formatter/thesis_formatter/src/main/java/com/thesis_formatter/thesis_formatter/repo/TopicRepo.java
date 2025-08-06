package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.enums.TopicStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepo extends JpaRepository<Topic, String> {
    List<Topic> findTopicsByForm_FormIdAndStatusIsNot(String formId, TopicStatus status);

    List<Topic> findTopicsByForm_FormIdAndStatusIs(String formId, TopicStatus status);

    List<Topic> findTopicsByTeachers_AcIdAndStatusIsNot(String AcId, TopicStatus status);

    Optional<Topic> findByStudents_AcIdAndStatusIs(String AcId, TopicStatus status);

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

    @Query("SELECT t FROM Topic t JOIN t.teachers teacher WHERE teacher = :teacher AND t.semester = :semester AND t.year = :year")
    List<Topic> findTopicsByTeacherAndSemesterAndYear(@Param("teacher") Teacher teacher,
                                                      @Param("semester") Semester semester,
                                                      @Param("year") String year);

    @Query("SELECT t FROM Topic t JOIN t.teachers teacher WHERE teacher = :teacher AND t.year = :year")
    List<Topic> findTopicsByTeacherAndYear(@Param("teacher") Teacher teacher,
                                           @Param("year") String year);

    @Query("SELECT t from Topic t JOIN t.students s where s.userId = :studentId AND t.status = com.thesis_formatter.thesis_formatter.enums.TopicStatus.PUBLISHED")
    Optional<Topic> findPublishedTopicsByStudent(@Param("studentId") String studentId);

    // A: Paginated topic lookup by acId, semester, and year
    @Query("SELECT t FROM Topic t JOIN t.teachers teacher " +
            "WHERE teacher.acId = :acId " +
            "AND t.semester = :semester " +
            "AND t.year = :year")
    Page<Topic> findTopicsByAcIdAndSemesterAndYear(@Param("acId") String acId,
                                                   @Param("semester") Semester semester,
                                                   @Param("year") String year,
                                                   Pageable pageable);

    // A: Paginated topic lookup by acId and year only
    @Query("SELECT t FROM Topic t JOIN t.teachers teacher " +
            "WHERE teacher.acId = :acId " +
            "AND t.year = :year")
    Page<Topic> findTopicsByAcIdAndYear(@Param("acId") String acId,
                                        @Param("year") String year,
                                        Pageable pageable);

    // B: List of published topics by teacher entity, semester, and year
    @Query("SELECT t FROM Topic t JOIN t.teachers teacher " +
            "WHERE teacher = :teacher " +
            "AND t.semester = :semester " +
            "AND t.year = :year " +
            "AND t.status = com.thesis_formatter.thesis_formatter.enums.TopicStatus.PUBLISHED")
    List<Topic> findPublishedTopicsByTeacherAndSemesterAndYear(@Param("teacher") Teacher teacher,
                                                               @Param("semester") Semester semester,
                                                               @Param("year") String year);
}
