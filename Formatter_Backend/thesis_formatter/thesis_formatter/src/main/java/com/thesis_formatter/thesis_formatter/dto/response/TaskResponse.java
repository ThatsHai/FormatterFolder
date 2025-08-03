package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;

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
    String filePath;
    boolean requireFile;
    boolean fileSubmitted;
}
