package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestoredVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "formRecordId", referencedColumnName = "formRecordId")
    FormRecord formRecord;
    int restoredVersion;    // phiên bản mới vừa được tạo ra
    int fromVersion;        // phiên bản cũ được khôi phục
    LocalDateTime restoredAt;

}
