package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String ST_id;
    String className;
    String major;
    String course;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ST_id",referencedColumnName = "AC_id")
    Account account;
}
