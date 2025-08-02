package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRecordRepo extends JpaRepository<FormRecord, String> {
    Page<FormRecord> findAllByStudent_UserIdAndStatusIsNot(String userId, Pageable pageable, FormStatus status);

    @Query("SELECT fr from FormRecord fr join fr.topic t join t.teachers teacher where teacher.acId = :userId and fr.status = :status")
    Page<FormRecord> findByTeacherAndStatus(@Param("userId") String userId, @Param("status") FormStatus status, Pageable pageable);

    @Query("""
            SELECT fr 
            FROM FormRecord fr 
            JOIN fr.topic t 
            JOIN t.teachers teacher 
            WHERE teacher.acId = :userId 
              AND fr.status IN :statuses
            """)
    Page<FormRecord> findByTeacherAndStatuses(
            @Param("userId") String userId,
            @Param("statuses") List<FormStatus> statuses,
            Pageable pageable
    );


    List<FormRecord> findByStudentAndTopic(Student student, Topic topic);

    @Query("SELECT f FROM FormRecord f WHERE f.student.userId = :studentId AND f.topic.topicId = :topicId AND f.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.DELETED")
    Optional<FormRecord> findDeletedByStudentAndTopic(@Param("studentId") String studentId, @Param("topicId") String topicId);

    List<FormRecord> findFormRecordByTopic_TopicId(String topicTopicId);

    @Query("SELECT fr from FormRecord fr join fr.topic t join t.teachers teacher where teacher.userId = :userId and fr.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.ACCEPTED and t.semester= :semester and t.year = :year")
    Page<FormRecord> findAcceptedByTeacherAndTime(@Param("userId") String userId, @Param("semester") Semester semester, @Param("year") String year, Pageable pageable);

    @Query("""
                select fr from FormRecord fr
                join fetch fr.topic t
                join fetch t.teachers teacher
                where fr.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.ACCEPTED
                    and t.semester = :semester and t.year = :year
            """)
    List<FormRecord> findAcceptedRecordsByGroupByTeacher(@Param("semester") Semester semester, @Param("year") String year);

}
