package com.thesis_formatter.thesis_formatter.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.enums.TopicStatus;
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
    String researchContent;
    @Column(columnDefinition = "TEXT")
    String objective;
    @Column(columnDefinition = "TEXT")
    String objectiveDetails;
    String funding;
    String contactInfo;
    String time;
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

    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference
    List<Student> students;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;
    @Enumerated
    Semester semester;
    String year;

    @Enumerated
    TopicStatus status = TopicStatus.UNPUBLISHED;
}
