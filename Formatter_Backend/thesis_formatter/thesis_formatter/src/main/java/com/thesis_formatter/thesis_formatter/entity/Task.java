package com.thesis_formatter.thesis_formatter.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String description;

    boolean completed = false;

    Date completedDate;

    boolean requireFile = false;

    String filePath;

    @ManyToOne
    Milestone milestone;

    public boolean isFileSubmitted() {
        return !requireFile || (filePath != null && !filePath.isBlank());
    }
}
