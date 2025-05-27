package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.enums.EducationLevel;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@PrimaryKeyJoinColumn(name = "acId")
public class Student extends Account {
    //    @Column(unique = true)
//    String stId;
    String course;

    @Enumerated(EnumType.STRING)
    EducationLevel educationLevel;

    @ManyToOne
    @JoinColumn(name = "studentClassId", referencedColumnName = "studentClassId")
    StudentClass studentClass;
}
