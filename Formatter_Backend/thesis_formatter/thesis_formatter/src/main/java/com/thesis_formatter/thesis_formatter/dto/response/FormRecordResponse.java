package com.thesis_formatter.thesis_formatter.dto.response;

import com.thesis_formatter.thesis_formatter.entity.FormRecordField;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FormRecordResponse {
    String formRecordId;
    List<FormRecordField> formRecordFields;
    String topicId;
    StudentDTO student;
    FormStatus status;
}