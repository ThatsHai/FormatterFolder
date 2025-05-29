package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.StudentDTO;
import com.thesis_formatter.thesis_formatter.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(source = "userId", target = "userId")
    StudentDTO toDTO(Student student);
}
