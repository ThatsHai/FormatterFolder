package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
}
