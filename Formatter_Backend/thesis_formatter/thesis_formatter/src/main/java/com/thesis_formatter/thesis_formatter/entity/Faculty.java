package com.thesis_formatter.thesis_formatter.entity;

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
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String facultyId;
    String facultyName;

//    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)
//    List<Account> accounts = new ArrayList<>();

    //Chưa liên kết giữa khoa và bộ môn
}
