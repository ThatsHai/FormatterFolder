package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.ProgressResponse;
import com.thesis_formatter.thesis_formatter.entity.Progress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MilestoneMapper.class, FormRecordMapper.class})
public interface ProgressMapper {
    @Mapping(source = "formRecord", target = "formRecord")
    @Mapping(source = "milestones", target = "milestones")
    ProgressResponse toProgressResponse(Progress progress);

    List<ProgressResponse> toProgressResponseList(List<Progress> progressList);
}
