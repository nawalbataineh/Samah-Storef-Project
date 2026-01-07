package com.samah.store.domain.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens",
        indexes = {
                @Index(name="idx_refresh_tokens_user", columnList = "user_id"),
                @Index(name="idx_refresh_tokens_expires", columnList = "expires_at")
        },
        uniqueConstraints = @UniqueConstraint(name="uk_refresh_tokens_hash", columnNames = "token_hash")
)
@Getter
@Setter
public class RefreshToken extends BaseEntity{
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="user_id", nullable=false,
            foreignKey = @ForeignKey(name="fk_refresh_tokens_user"))
    private User user;

    @Column(name="token_hash", nullable=false, length=64)
    private String tokenHash; // SHA-256 hex

    @Column(name="expires_at", nullable=false)
    private Instant expiresAt;

    @Column(name="revoked_at")
    private Instant revokedAt;

    @Column(name="replaced_by_hash", length=64)
    private String replacedByHash;

    @Column(name="issued_ip", length=45)
    private String issuedIp;

    @Column(name="user_agent", length=255)
    private String userAgent;

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public boolean isExpired() {
        return expiresAt.isBefore(Instant.now());
    }
}
