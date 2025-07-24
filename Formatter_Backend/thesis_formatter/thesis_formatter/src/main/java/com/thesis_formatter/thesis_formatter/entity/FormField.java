package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.itextpdf.text.Font;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FormField {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String formFieldId;
    String fieldName;
    int position;
    String description;
    String fieldType;
    int length;
    @ManyToOne
    @JoinColumn(name = "formId", referencedColumnName = "formId")
    @JsonBackReference
    Form form;
}
