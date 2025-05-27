package com.thesis_formatter.thesis_formatter.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class FormRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formRecordId;
    String fieldDetail;

    @OneToMany(mappedBy = "formRecord", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<FormRecordField> formRecordFields;

    @ManyToOne
    @JoinColumn(name = "form_id")
    Form form;

    @ManyToOne
//    @JoinColumn(name = "student_id", nullable = false)
    @JoinColumn(name = "student_id")
    Student student;
}

