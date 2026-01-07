package com.samah.store.dto;

import java.math.BigDecimal;

public record OrderItemDto(Long id, String productName, String variantSku, String size, String color,
                           BigDecimal unitPrice, Integer quantity, BigDecimal lineTotal) {}

