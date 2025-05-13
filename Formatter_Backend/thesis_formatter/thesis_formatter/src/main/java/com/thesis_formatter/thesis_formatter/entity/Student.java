package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student {
    String className;
    String major;
    String course;

    @Id
    String ST_id;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ST_id",referencedColumnName = "AC_id")
    Account account;
}
