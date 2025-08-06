package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import com.thesis_formatter.thesis_formatter.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(source = "files", target = "taskFiles")
    TaskResponse taskToTaskResponse(Task task);
}
