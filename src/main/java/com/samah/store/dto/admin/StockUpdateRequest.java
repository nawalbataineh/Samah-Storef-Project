package com.samah.store.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockUpdateRequest(
        @NotNull(message = "Stock value is required")
        @Min(value = 0, message = "Stock cannot be negative")
        Integer stockQuantity
) {}

