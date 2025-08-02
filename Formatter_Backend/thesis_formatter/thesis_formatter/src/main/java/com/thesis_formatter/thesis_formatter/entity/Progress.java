package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String progressId;

    @OneToOne
    FormRecord formRecord;

    @OneToMany(mappedBy = "progress", cascade = CascadeType.ALL)
    List<Milestone> milestones;
}
