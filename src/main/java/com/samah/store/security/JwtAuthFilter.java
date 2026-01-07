package com.samah.store.security;

import com.samah.store.domain.entites.User;
import com.samah.store.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter{
    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService JwtService, UserRepository userRepository) {
        this.jwtService = JwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            log.debug("No Bearer token found for request: {} {}", request.getMethod(), request.getRequestURI());
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            JwtService.JwtParsed parsed = jwtService.parseAndValidate(token);
            log.debug("Parsed JWT - userId: {}, role: {}", parsed.userId(), parsed.role());

            var user = userRepository.findById(parsed.userId()).orElse(null);
            if (user == null || !user.isEnabled() || user.isDeleted()) {
                log.warn("User not found or disabled for userId: {}", parsed.userId());
                chain.doFilter(request, response);
                return;
            }

            // tokenVersion check => طرد فوري
            if (user.getTokenVersion() != parsed.tokenVersion()) {
                log.warn("Token version mismatch for userId: {}. Expected: {}, Got: {}",
                    parsed.userId(), user.getTokenVersion(), parsed.tokenVersion());
                chain.doFilter(request, response);
                return;
            }

            String authority = "ROLE_" + user.getRole().name();
            log.debug("Setting authentication - username: {}, authority: {}", user.getUsername(), authority);

            var auth = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    null,
                    List.of(new SimpleGrantedAuthority(authority))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            log.error("JWT processing error: {}", e.getMessage());
            // invalid token => treat as unauthenticated
        }

        chain.doFilter(request, response);
    }
}
