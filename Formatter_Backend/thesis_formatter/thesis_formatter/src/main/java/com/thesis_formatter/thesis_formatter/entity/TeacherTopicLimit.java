package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherTopicLimit {

    @EmbeddedId
    private TeacherTopicLimitId id;

    @ManyToOne
    @JoinColumn(name = "ac_Id", referencedColumnName = "acId", insertable = false, updatable = false)
    private Teacher teacher;


    private int maxTopics;
}
