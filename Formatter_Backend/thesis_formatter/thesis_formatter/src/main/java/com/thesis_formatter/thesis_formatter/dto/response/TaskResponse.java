package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.TaskFile;
import jakarta.annotation.Nullable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskResponse {
    String id;
    String name;
    String description;
    boolean completed;
    Date completedDate;
    boolean requireFile;
    boolean fileSubmitted;
    int maxNumberOfFiles;
    @Nullable
    List<TaskFile> taskFiles;
}
