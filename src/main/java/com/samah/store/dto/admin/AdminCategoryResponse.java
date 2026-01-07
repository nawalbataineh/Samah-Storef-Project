package com.samah.store.dto.admin;

import java.time.Instant;

public record AdminCategoryResponse(
        Long id,
        String name,
        String slug,
        boolean active,
        boolean deleted,
        int productCount,
        Instant createdAt,
        Instant updatedAt
) {}

