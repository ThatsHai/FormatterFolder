package com.thesis_formatter.thesis_formatter.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formId;
    String title;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "studentId", referencedColumnName = "userId")
    Student student;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "teacher_form_map",
            joinColumns = @JoinColumn(
                    name = "formId",
                    referencedColumnName = "formId"
            ), inverseJoinColumns = @JoinColumn(
            name = "teacherId",
            referencedColumnName = "userId"

    )
    )
    List<Teacher> teachers;
    String introduction;
}
