package com.thesis_formatter.thesis_formatter.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateFormRecordFieldRequest {
    String formRecordFieldId;
    String formFieldId;
    String value;
}
