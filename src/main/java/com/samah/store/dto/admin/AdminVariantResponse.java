package com.samah.store.dto.admin;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminVariantResponse(
        Long id,
        Long productId,
        String productName,
        String sku,
        String size,
        String color,
        BigDecimal price,
        Integer stockQuantity,
        boolean active,
        boolean deleted,
        Instant createdAt,
        Instant updatedAt
) {}

