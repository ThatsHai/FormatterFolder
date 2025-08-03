package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import com.thesis_formatter.thesis_formatter.entity.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskResponse taskToTaskResponse(Task task);
}
