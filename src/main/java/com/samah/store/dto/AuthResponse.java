package com.samah.store.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserInfo user) {

    public record UserInfo(
            Long id,
            String username,
            String email,
            String role
    ) {}
}
