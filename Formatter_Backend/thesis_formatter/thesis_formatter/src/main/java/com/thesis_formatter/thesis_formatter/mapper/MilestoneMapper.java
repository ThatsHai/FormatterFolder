package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.MilestoneResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface MilestoneMapper {
    @Mapping(source = "position", target = "position")
    @Mapping(source = "completed", target = "completed")
    @Mapping(source = "tasks", target = "tasks")
    MilestoneResponse toResponse(Milestone milestone);
}
