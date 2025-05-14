package com.thesis_formatter.thesis_formatter.entity;


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
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String title;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student")

    String introduction;
}
