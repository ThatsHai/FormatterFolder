package com.thesis_formatter.thesis_formatter.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formId;
    String title;

//    @ManyToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "studentId", referencedColumnName = "stId")
//    Student student;

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
    @Enumerated(EnumType.STRING)
    FormStatus status = FormStatus.WAITING;
    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<FormField> formFields;
}
