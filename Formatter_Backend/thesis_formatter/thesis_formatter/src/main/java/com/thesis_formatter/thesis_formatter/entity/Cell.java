package com.thesis_formatter.thesis_formatter.entity;

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
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "designId", referencedColumnName = "designId")
    Design design;
}
