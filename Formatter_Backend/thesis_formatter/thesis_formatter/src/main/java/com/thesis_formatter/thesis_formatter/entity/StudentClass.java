package com.thesis_formatter.thesis_formatter.entity;

import com.thesis_formatter.thesis_formatter.enums.AvailabilityEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class StudentClass {
    @Id
    String studentClassId;
    String studentClassName;
    @ManyToOne
    @JoinColumn(name = "majorId", referencedColumnName = "majorId")
    Major major;
    @Enumerated
    AvailabilityEnum availability = AvailabilityEnum.ACTIVE;
}
