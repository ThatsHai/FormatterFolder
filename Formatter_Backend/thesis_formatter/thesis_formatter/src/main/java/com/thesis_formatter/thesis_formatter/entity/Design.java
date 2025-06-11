package com.thesis_formatter.thesis_formatter.entity;

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
public class Design {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String designId;
    String title;
    String description;
    @OneToMany(mappedBy = "design", cascade = CascadeType.ALL)
    List<Cell> cells;
}
