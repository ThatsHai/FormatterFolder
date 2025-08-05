package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Progress;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressRepo extends JpaRepository<Progress, String> {
    @Query("""
                select p from Progress p
                join p.formRecord fr
                join fr.topic t
                join t.teachers tc
                where fr.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.ACCEPTED
                             and tc.userId = :teacherId and t.semester = :semester and t.year = :year
            """)
    Page<Progress> findProgressByUserAndTime(@Param("teacherId") String teacherId, @Param("semester") Semester semester, @Param("year") String year, Pageable pageable);
        @Query("""
                select p from Progress p
                join p.formRecord fr
                where fr.status = com.thesis_formatter.thesis_formatter.enums.FormStatus.ACCEPTED
                             and fr.student.userId = :studentId
            """)
    Progress findByStudent(@Param("studentId") String studentId);
}
