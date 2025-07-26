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
    @Column(unique = true)
    String title;
    String description;
    @ElementCollection
    List<String> readersList;
    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<FormField> formFields;
}
