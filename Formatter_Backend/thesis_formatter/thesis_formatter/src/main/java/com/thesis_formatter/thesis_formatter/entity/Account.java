package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
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
    String phoneNumber;
    String email;
    String avatar;
    String status;

    @ManyToOne
    @JoinColumn(name = "role", referencedColumnName = "name")
    Role role;


}
