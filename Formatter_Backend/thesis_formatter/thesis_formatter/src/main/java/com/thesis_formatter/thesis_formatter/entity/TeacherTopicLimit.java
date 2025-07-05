package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.enums.Semester;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherTopicLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @ManyToOne
    @JoinColumn(referencedColumnName = "acId")
    Teacher teacher;
    @Enumerated(EnumType.STRING)
    Semester semester;
    String schoolYear;
    int maxTopics;
}
