package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FormRecordField {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String formRecordFieldId;

    @Column(columnDefinition = "TEXT")
    String value;

    @ManyToOne
    @JoinColumn(name = "formFieldId")
    FormField formField;

    @ManyToOne
    @JoinColumn(name = "formRecordId")
    @JsonBackReference
    FormRecord formRecord;

    LocalDateTime createdAt = LocalDateTime.now();

    int version = 0;
    boolean changed = false;
}
