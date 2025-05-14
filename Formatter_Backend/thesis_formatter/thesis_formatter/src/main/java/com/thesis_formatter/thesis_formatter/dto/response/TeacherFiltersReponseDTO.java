package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.Teacher;

import java.io.Serializable;

public record TeacherFiltersReponseDTO(
        String teacherId,
        String teacherName
)implements Serializable {
}
