package com.thesis_formatter.thesis_formatter.entity;

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
public class Major {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String majorId;
    String majorName;

    @ManyToOne
    @JoinColumn(name = "departmentId", referencedColumnName = "departmentId")
    Department department;
}
