package com.samah.store.dto;

import java.math.BigDecimal;

public record CartItemDto(Long id, ProductVariantDto variant, Integer quantity, BigDecimal lineTotal) {}

