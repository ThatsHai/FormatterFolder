package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class FormRecordField {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formRecordFieldId;
    String value;
    

    @ManyToOne
    @JoinColumn(name = "form_field_id")
    FormField formField;

    @ManyToOne
    @JoinColumn(name = "form_record_id")
    @JsonBackReference
    FormRecord formRecord;
}
