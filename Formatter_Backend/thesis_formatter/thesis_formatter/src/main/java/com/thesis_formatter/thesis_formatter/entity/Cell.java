package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Cell {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String cellId;
    int colSpan;
    int rowSpan;
    String text;
    int leftPos;
    int topPos;
    boolean fromDataSource;
    boolean fromDrag;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "designId", referencedColumnName = "designId")
    @JsonBackReference
    Design design;
}
