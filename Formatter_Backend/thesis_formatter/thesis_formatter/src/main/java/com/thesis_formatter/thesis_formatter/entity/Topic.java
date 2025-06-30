package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String topicId;
    String title;
    String description;
    @Column(columnDefinition = "TEXT")
    String objective;
    String funding;
    String fundingSource;
    String contactInfo;
    String implementationTime;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "teacher_topic",
            joinColumns = @JoinColumn(name = "topicId"),
            inverseJoinColumns = @JoinColumn(name = "acId")
    )
    List<Teacher> teachers;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "major_topic",
            joinColumns = @JoinColumn(name = "topicId"),
            inverseJoinColumns = @JoinColumn(name = "majorId")
    )
    List<Major> majors;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "formId", referencedColumnName = "formId")
    Form form;

    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
