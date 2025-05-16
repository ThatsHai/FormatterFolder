package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String departmentId;
    String departmentName;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "facultyId",referencedColumnName = "facultyId")
    Faculty faculty;
}
