package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.MilestoneResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface MilestoneMapper {
    MilestoneResponse toResponse(Milestone milestone);
}
