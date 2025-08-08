package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String acId;
    @Column(unique = true, nullable = false)
    String userId;
    @Column(nullable = false)
    String password;
    @Column(nullable = false)
    String name;
    @Column(nullable = false)
    String dateOfBirth;
    @Column(nullable = false)
    String gender;
    @Column(nullable = false)
    String phoneNumber;
    @Column(nullable = false)
    String email;
    @Column(nullable = false)
    String status;

    @ManyToOne
    @JoinColumn(name = "role", referencedColumnName = "name")
    Role role;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> sentNotifications;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationReceiver> receivedNotifications;

}
