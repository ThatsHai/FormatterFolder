package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FormRecordFieldDiff {
    String formFieldId;
    String fieldName;
    String oldValue;
    String newValue;
    String fieldType;
    int position;
    LocalDateTime modifiedAt;
}
