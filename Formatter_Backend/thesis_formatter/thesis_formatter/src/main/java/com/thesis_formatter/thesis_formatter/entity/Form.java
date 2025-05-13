package com.thesis_formatter.thesis_formatter.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Form {
    @Id
    String id;
    String title;
    String studentName;
    String studentID;
    String department;
    String unit;
    String school;
    String year;
    List <String> CBHD;
    String introduction;
}
