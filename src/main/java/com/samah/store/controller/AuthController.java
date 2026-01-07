package com.samah.store.controller;
import com.samah.store.domain.entites.User;
import com.samah.store.domain.enums.Role;
import com.samah.store.dto.AuthResponse;
import com.samah.store.dto.LoginRequest;
import com.samah.store.dto.RegisterRequest;
import com.samah.store.repository.UserRepository;
import com.samah.store.security.JwtService;
import com.samah.store.security.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.samah.store.security.RefreshTokenService.REFRESH_COOKIE_NAME;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req,
                                                 HttpServletRequest httpReq,
                                                 HttpServletResponse httpRes) {
        // register as CUSTOMER only
        if (userRepository.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setRole(Role.CUSTOMER);
        u.setEnabled(true);
        userRepository.save(u);

        // issue tokens
        String access = jwtService.generateAccessToken(u);
        var refresh = refreshTokenService.issue(u, httpReq);
        setRefreshCookie(httpRes, refresh.rawToken(), refresh.expiresAt().getEpochSecond());

        var userInfo = new AuthResponse.UserInfo(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name());
        return ResponseEntity.ok(new AuthResponse(access, "Bearer", userInfo));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req,
                                              HttpServletRequest httpReq,
                                              HttpServletResponse httpRes) {

        Optional<User> userOpt = req.usernameOrEmail().contains("@")
                ? userRepository.findByEmail(req.usernameOrEmail())
                : userRepository.findByUsername(req.usernameOrEmail());

        User user = userOpt.orElse(null);
        if (user == null || !user.isEnabled() || user.isDeleted()) {
            return ResponseEntity.status(401).build();
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).build();
        }

        String access = jwtService.generateAccessToken(user);
        var refresh = refreshTokenService.issue(user, httpReq);
        setRefreshCookie(httpRes, refresh.rawToken(), refresh.expiresAt().getEpochSecond());

        var userInfo = new AuthResponse.UserInfo(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(access, "Bearer", userInfo));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest httpReq, HttpServletResponse httpRes) {
        String rawRefresh = readCookie(httpReq, REFRESH_COOKIE_NAME);
        if (rawRefresh == null) return ResponseEntity.status(401).build();

        try {
            var rotated = refreshTokenService.rotate(rawRefresh, httpReq);

            // IMPORTANT: if user disabled or tokenVersion changed => reject
            User user = rotated.user();
            if (!user.isEnabled() || user.isDeleted()) {
                return ResponseEntity.status(401).build();
            }

            String access = jwtService.generateAccessToken(user);
            setRefreshCookie(httpRes, rotated.refresh().rawToken(), rotated.refresh().expiresAt().getEpochSecond());

            var userInfo = new AuthResponse.UserInfo(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(new AuthResponse(access, "Bearer", userInfo));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpReq, HttpServletResponse httpRes) {
        String rawRefresh = readCookie(httpReq, REFRESH_COOKIE_NAME);
        if (rawRefresh != null) {
            refreshTokenService.revoke(rawRefresh);
        }
        clearRefreshCookie(httpRes);
        return ResponseEntity.noContent().build();
    }

    private static void setRefreshCookie(HttpServletResponse res, String value, long expiresEpochSeconds) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // اجعليها true عند HTTPS على السيرفر
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge((int) Math.max(0, expiresEpochSeconds - (System.currentTimeMillis() / 1000)));
        res.addCookie(cookie);
    }

    private static void clearRefreshCookie(HttpServletResponse res) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        res.addCookie(cookie);
    }

    private static String readCookie(HttpServletRequest req, String name) {
        if (req.getCookies() == null) return null;
        for (Cookie c : req.getCookies()) {
            if (name.equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
