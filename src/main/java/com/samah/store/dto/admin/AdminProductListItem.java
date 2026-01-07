package com.samah.store.dto.admin;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminProductListItem(
        Long id,
        String name,
        String slug,
        Long categoryId,
        String categoryName,
        boolean active,
        boolean deleted,
        int totalStock,
        BigDecimal minPrice,
        String primaryImageUrl,
        Instant createdAt
) {}

