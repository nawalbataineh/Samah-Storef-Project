package com.samah.store.dto;

import java.time.Instant;

public record HeroSettingsResponseDto(
        Long id,
        String badgeText,
        String titleLine1,
        String titleLine2,
        String description,
        String ctaText,
        String ctaLink,
        String heroImageUrl,
        Instant updatedAt
) {
}

