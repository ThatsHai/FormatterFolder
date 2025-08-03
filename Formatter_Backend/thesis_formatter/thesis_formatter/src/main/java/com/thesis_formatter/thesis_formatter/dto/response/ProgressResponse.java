package com.thesis_formatter.thesis_formatter.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgressResponse {
    String progressId;
    FormRecordResponse formRecordResponse;
    List<MilestoneResponse> milestoneResponses;

}
