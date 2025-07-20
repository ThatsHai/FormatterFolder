package com.thesis_formatter.thesis_formatter.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@DynamicUpdate
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
    @Column(length = 20)
    FormStatus status = FormStatus.PENDING;

    LocalDateTime createdAt = LocalDateTime.now();
    LocalDateTime lastModifiedAt = LocalDateTime.now();

    int version = 0;

}

