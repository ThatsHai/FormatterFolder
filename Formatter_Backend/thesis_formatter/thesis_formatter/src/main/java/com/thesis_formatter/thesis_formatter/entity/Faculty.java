package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.enums.AvailabilityEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Faculty {
    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    String facultyId;
    String facultyName;
    @Enumerated
    AvailabilityEnum availability = AvailabilityEnum.ACTIVE;
}
