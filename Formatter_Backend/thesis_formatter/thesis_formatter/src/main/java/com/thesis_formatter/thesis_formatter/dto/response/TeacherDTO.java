package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.Department;
import com.thesis_formatter.thesis_formatter.entity.Role;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO {
    String acId;
    String userId;
    String name;
    String gender;
    String dateOfBirth;
    String phoneNumber;
    String email;
    Role role;
    Department department;
    String degree;
    String position;
}
