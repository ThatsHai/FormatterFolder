package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    String AC_id;
    String password;
    String name;
    String dateOfBirth;
    String gender;
    String address;
    String faculty;
    String phoneNumber;
    String email;
    String avatar;
    String Status;
    @OneToOne(mappedBy = "account",cascade = CascadeType.ALL)
    Student student;

    @OneToOne(mappedBy = "account",cascade = CascadeType.ALL)
    Teacher teacher;


}
