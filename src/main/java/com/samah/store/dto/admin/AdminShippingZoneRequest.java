package com.samah.store.dto.admin;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AdminShippingZoneRequest(
        @NotBlank(message = "City is required")
        @Size(max = 50, message = "City must not exceed 50 characters")
        String city,

        @NotNull(message = "Shipping fee is required")
        @DecimalMin(value = "0.00", message = "Shipping fee cannot be negative")
        BigDecimal shippingFee
) {}

