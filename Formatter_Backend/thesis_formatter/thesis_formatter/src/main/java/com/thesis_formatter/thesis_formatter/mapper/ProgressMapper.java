package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.ProgressResponse;
import com.thesis_formatter.thesis_formatter.entity.Progress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MilestoneMapper.class})
public interface ProgressMapper {
    ProgressResponse toProgressResponse(Progress progress);
}
