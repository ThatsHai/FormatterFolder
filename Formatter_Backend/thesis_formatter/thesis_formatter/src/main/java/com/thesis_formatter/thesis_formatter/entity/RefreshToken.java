package com.thesis_formatter.thesis_formatter.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Date expiryTime;

    @Column(nullable = false)
    private boolean revoked;

    @Column(nullable = false, updatable = false)
    private Date issuedAt;
}
