package com.samah.store.dto.admin;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record AdminVariantRequest(
        @NotBlank(message = "SKU is required")
        @Size(max = 40, message = "SKU must not exceed 40 characters")
        String sku,

        @NotBlank(message = "Size is required")
        @Size(max = 10, message = "Size must not exceed 10 characters")
        String size,

        @NotBlank(message = "Color is required")
        @Size(max = 30, message = "Color must not exceed 30 characters")
        String color,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock cannot be negative")
        Integer stockQuantity,

        Boolean active
) {}

