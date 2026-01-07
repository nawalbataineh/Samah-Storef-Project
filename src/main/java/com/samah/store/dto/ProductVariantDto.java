package com.samah.store.dto;

import java.math.BigDecimal;

public record ProductVariantDto(Long id, String sku, String size, String color,
                                BigDecimal price, Integer stockQuantity, boolean active, boolean deleted) {}

