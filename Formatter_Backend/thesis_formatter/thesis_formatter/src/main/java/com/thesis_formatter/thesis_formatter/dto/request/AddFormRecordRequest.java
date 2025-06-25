package com.thesis_formatter.thesis_formatter.dto.request;

import com.thesis_formatter.thesis_formatter.entity.FormRecordField;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddFormRecordRequest {
    String studentId;
    String topicId;
    List<FormRecordFieldRequest> formRecordFields;
}
