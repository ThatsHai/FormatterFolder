package com.thesis_formatter.thesis_formatter.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherSearchCriteria {
    String departmentId;
    String facultyId;
    String name;
    String userId;
}
