package com.samah.store.security;

import com.samah.store.domain.entites.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class JwtService {
    private final SecretKey key;
    private final String issuer;
    private final long accessMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.access-minutes}") long accessMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.issuer = issuer;
        this.accessMinutes = accessMinutes;
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessMinutes * 60);

        return Jwts.builder()
                .issuer(issuer)
                .subject(String.valueOf(user.getId()))
                .claim("role", user.getRole().name())
                .claim("tv", user.getTokenVersion())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }
    

    public JwtParsed parseAndValidate(String token) {
        var claims = Jwts.parser()
                .verifyWith(key)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        long userId = Long.parseLong(claims.getSubject());
        String role = claims.get("role", String.class);
        long tv = claims.get("tv", Number.class).longValue();

        return new JwtParsed(userId, role, tv);
    }

    public record JwtParsed(long userId, String role, long tokenVersion) {}

}
