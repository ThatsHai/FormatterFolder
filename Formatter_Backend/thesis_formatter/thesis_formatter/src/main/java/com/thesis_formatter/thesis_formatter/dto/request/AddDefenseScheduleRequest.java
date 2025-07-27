package com.thesis_formatter.thesis_formatter.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddDefenseScheduleRequest {
    String stt;
    String formRecordId;
    List<String> teacherIds;
    LocalDateTime startTime;
    String place;
}
