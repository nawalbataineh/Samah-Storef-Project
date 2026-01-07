package com.samah.store.dto.admin;

import java.time.Instant;

public record AdminImageResponse(
        Long id,
        Long productId,
        String url,
        Integer sortOrder,
        Instant createdAt
) {}

