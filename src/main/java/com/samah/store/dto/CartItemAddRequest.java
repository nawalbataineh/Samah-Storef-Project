package com.samah.store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemAddRequest(
        @NotNull Long variantId,
        @Min(1) int quantity
) {}
