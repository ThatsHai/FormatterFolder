package com.thesis_formatter.thesis_formatter.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FormRecordVersionInfo {
    int version;
    String modifiedAt; // "HH:mm:ss dd-MM-yyyy"
    Integer restoredFromVersion;
}
