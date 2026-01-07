package com.samah.store.security;

import com.samah.store.domain.entites.RefreshToken;
import com.samah.store.domain.entites.User;
import com.samah.store.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RefreshTokenService {
    public static final String REFRESH_COOKIE_NAME = "refresh_token";

    private final RefreshTokenRepository repo;
    private final long refreshDays;

    public RefreshTokenService(RefreshTokenRepository repo,
                               @Value("${app.jwt.refresh-days}") long refreshDays) {
        this.repo = repo;
        this.refreshDays = refreshDays;
    }

    public IssuedRefresh issue(User user, HttpServletRequest req) {
        String raw = UUID.randomUUID() + "." + UUID.randomUUID();
        String hash = sha256Hex(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hash);
        rt.setExpiresAt(Instant.now().plusSeconds(refreshDays * 24 * 3600));
        rt.setIssuedIp(clientIp(req));
        rt.setUserAgent(truncate(req.getHeader("User-Agent"), 255));
        repo.save(rt);

        return new IssuedRefresh(raw, rt.getExpiresAt());
    }

    public RotatedRefresh rotate(String rawToken, HttpServletRequest req) {
        String hash = sha256Hex(rawToken);
        RefreshToken existing = repo.findByTokenHash(hash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (existing.isRevoked() || existing.isExpired()) {
            throw new IllegalArgumentException("Refresh token expired/revoked");
        }

        // issue new
        IssuedRefresh newOne = issue(existing.getUser(), req);

        // revoke old (rotation)
        existing.setRevokedAt(Instant.now());
        existing.setReplacedByHash(sha256Hex(newOne.rawToken()));
        repo.save(existing);

        return new RotatedRefresh(existing.getUser(), newOne);
    }

    public void revoke(String rawToken) {
        String hash = sha256Hex(rawToken);
        repo.findByTokenHash(hash).ifPresent(rt -> {
            if (!rt.isRevoked()) {
                rt.setRevokedAt(Instant.now());
                repo.save(rt);
            }
        });
    }

    private static String sha256Hex(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }

    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }

    public record IssuedRefresh(String rawToken, Instant expiresAt) {}
    public record RotatedRefresh(User user, IssuedRefresh refresh) {}
}
