package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByJti(String jti);
}
