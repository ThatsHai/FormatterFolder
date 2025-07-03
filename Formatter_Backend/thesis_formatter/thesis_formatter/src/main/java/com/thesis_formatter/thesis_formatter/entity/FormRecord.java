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
public class FormRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formRecordId;
    @OneToMany(mappedBy = "formRecord", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<FormRecordField> formRecordFields;
//
//    @ManyToOne
//    @JoinColumn(name = "formId")
//    Form form;

    @ManyToOne
    @JoinColumn(name = "topicId")
    Topic topic;

    @ManyToOne
//    @JoinColumn(name = "student_id", nullable = false)
    @JoinColumn(name = "acId")
    Student student;

    @Enumerated(EnumType.STRING)
    FormStatus status = FormStatus.PENDING;
}

