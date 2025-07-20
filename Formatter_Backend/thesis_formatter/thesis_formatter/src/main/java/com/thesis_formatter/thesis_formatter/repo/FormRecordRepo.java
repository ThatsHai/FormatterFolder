package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
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

    List<FormRecord> findByStudentAndTopic(Student student, Topic topic);

    @Query("SELECT f FROM FormRecord f WHERE f.student.userId = :studentId AND f.topic.topicId = :topicId AND f.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.DELETED")
    Optional<FormRecord> findDeletedByStudentAndTopic(@Param("studentId") String studentId, @Param("topicId") String topicId);


}
