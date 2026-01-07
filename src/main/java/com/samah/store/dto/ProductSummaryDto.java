package com.samah.store.dto;

import java.math.BigDecimal;

public record ProductSummaryDto(Long id, String name, String slug, boolean active, boolean deleted,
                                CategoryDto category, String primaryImageUrl, BigDecimal minVariantPrice) {}

