package com.samah.store.dto.admin;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record AdminProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        Long categoryId,
        String categoryName,
        boolean active,
        boolean deleted,
        int totalStock,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<AdminVariantResponse> variants,
        List<AdminImageResponse> images,
        Instant createdAt,
        Instant updatedAt
) {}

