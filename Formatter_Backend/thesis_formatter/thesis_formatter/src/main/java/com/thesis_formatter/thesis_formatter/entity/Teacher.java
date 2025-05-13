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
public class Teacher {
    @Id
    String TC_id;
    String expertise;
    String degree;
    String position;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TC_id",referencedColumnName = "AC_id")
    Account account;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TC_department", referencedColumnName = "DP_id")
    Department department;
}
