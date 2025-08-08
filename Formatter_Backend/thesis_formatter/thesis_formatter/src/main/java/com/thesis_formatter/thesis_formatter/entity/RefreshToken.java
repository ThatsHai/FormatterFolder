package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.apache.catalina.User;

import java.util.Date;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshToken {
    @Id
    String jti;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    Account account;

    @Column(nullable = false)
    private Date expiryTime;

    @Column(nullable = false)
    private boolean revoked;

    @Column(nullable = false, updatable = false)
    private Date issuedAt;
}
