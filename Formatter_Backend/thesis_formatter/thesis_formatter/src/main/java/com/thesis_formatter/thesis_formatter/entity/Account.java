package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Set;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String acId;
    @Column(unique = true, nullable = false)
    String userId;
    String password;
    String name;
    String dateOfBirth;
    String gender;
    String address;
    String phoneNumber;
    String email;
    String avatar;
    String Status;
    Set<String> roles;
//
//    @ManyToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "facultyId", referencedColumnName = "facultyId")
//    Faculty faculty;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "departmentId", referencedColumnName = "departmentId")
    Department department;

}
