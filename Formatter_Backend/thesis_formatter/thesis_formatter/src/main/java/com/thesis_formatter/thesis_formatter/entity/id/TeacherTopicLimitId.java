package com.thesis_formatter.thesis_formatter.entity.id;

import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherTopicLimitId implements Serializable {

    @Column(name = "teacher_id") // This maps to teacher.acId
    private String teacherId;

    @Enumerated
    private Semester semester;

    private String schoolYear;
}
