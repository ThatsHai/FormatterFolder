package com.thesis_formatter.thesis_formatter.dto.request;

import com.thesis_formatter.thesis_formatter.entity.TaskFile;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddTaskRequest {
    String milestoneId;
    String title;
    String description;
    boolean requiredFile;
    int maxNumberOfFiles;
}
