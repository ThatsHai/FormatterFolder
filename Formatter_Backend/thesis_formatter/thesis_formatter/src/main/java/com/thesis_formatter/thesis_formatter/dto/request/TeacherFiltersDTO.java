package com.thesis_formatter.thesis_formatter.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.Serializable;


public record TeacherFiltersDTO (
    String faculty,
    String departmentName,
    String teacherId,
    String teacherName
) implements Serializable{

}
