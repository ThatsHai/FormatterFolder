package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.request.FacultyRequest;
import com.thesis_formatter.thesis_formatter.dto.response.FacultyResponse;
import com.thesis_formatter.thesis_formatter.entity.Faculty;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FacultyMapper {
    Faculty toFaculty(FacultyRequest request);
    FacultyResponse toFacultyResponse(Faculty faculty);
    List <FacultyResponse> toFacultyResponseList(List<Faculty> faculties);
}
