package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {
    @Mapping(source = "userId", target = "userId")
    TeacherDTO toDTO(Teacher teacher);
    List<TeacherDTO> toDTOList(List<Teacher> teachers);

}
