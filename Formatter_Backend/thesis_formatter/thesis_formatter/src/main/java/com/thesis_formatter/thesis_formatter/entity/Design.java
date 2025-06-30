package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Design {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String designId;
    String title;
    String description;
    @OneToMany(mappedBy = "design", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<Cell> cells = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "formId")
    Form form;
}
