package com.studentmanagement.backend.service;

import com.studentmanagement.backend.model.RevokedToken;
import com.studentmanagement.backend.repository.RevokedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenBlacklistService {

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    public void revoke(String tokenId, Date expiration) {
        if (revokedTokenRepository.existsByTokenId(tokenId)) {
            return; // already revoked, logging out twice is harmless
        }
        RevokedToken revoked = new RevokedToken();
        revoked.setTokenId(tokenId);
        revoked.setExpiresAt(LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault()));
        revokedTokenRepository.save(revoked);
    }

    public boolean isRevoked(String tokenId) {
        return tokenId != null && revokedTokenRepository.existsByTokenId(tokenId);
    }

    // Once a token has expired on its own it can't be used anyway, so its blacklist row is dead weight
    @Scheduled(fixedRate = 60 * 60 * 1000) // every hour
    @Transactional
    public void removeExpiredEntries() {
        revokedTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}