package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.thesis_formatter.thesis_formatter.enums.EducationLevel;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@SuperBuilder
public class Student extends Account {

    @Enumerated(EnumType.STRING)
    EducationLevel educationLevel;

    @ManyToOne
    @JoinColumn(name = "studentClassId", referencedColumnName = "studentClassId")
    StudentClass studentClass;
}
