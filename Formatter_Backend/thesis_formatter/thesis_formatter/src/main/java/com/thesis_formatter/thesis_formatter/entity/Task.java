package com.thesis_formatter.thesis_formatter.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    boolean completed = false;

    Date completedDate;

    boolean requireFile = false;
    int maxNumberOfFiles = 10;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<TaskFile> files = new ArrayList<>();

    @ManyToOne
    Milestone milestone;

    public boolean isFileSubmitted() {
        return !requireFile || (!files.isEmpty());
    }
}
