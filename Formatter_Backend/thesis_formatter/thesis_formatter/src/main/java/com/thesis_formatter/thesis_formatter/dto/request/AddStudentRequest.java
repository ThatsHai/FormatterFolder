package com.thesis_formatter.thesis_formatter.dto.request;

import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.enums.EducationLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddStudentRequest {
    String name;
    String userId;
    String dateOfBirth;
    String gender;
    String phoneNumber;
    String classId;
    String password;
}
