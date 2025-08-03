package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    Boolean completed;
    Date dueDate;

    @ManyToOne
    Progress progress;

    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL)
    List<Task> tasks;

    public boolean isCompleted() {
        return tasks != null && tasks.stream().allMatch(Task::isCompleted);
    }
}
