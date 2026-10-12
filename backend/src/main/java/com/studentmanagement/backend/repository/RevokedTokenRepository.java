package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByTokenId(String tokenId);
    void deleteByExpiresAtBefore(LocalDateTime time);
}