package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DefenseSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne
    @JoinColumn(name = "formRecordId", unique = true)
    FormRecord formRecord;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "defense_schedule_teacher",
            joinColumns = @JoinColumn(name = "defense_schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    List<Teacher> teachers;


    LocalDateTime startTime;
    String place;
}
