package com.samah.store.dto.admin;

import com.samah.store.domain.enums.CouponType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;

public record AdminCouponRequest(
        @NotBlank(message = "Coupon code is required")
        @Size(max = 40, message = "Code must not exceed 40 characters")
        String code,

        @NotNull(message = "Coupon type is required")
        CouponType type,

        @NotNull(message = "Value is required")
        @DecimalMin(value = "0.01", message = "Value must be greater than 0")
        BigDecimal value,

        @DecimalMin(value = "0.00", message = "Minimum order total cannot be negative")
        BigDecimal minOrderTotal,

        Instant startAt,

        Instant endAt,

        @Min(value = 1, message = "Usage limit total must be at least 1")
        Integer usageLimitTotal,

        @Min(value = 1, message = "Usage limit per user must be at least 1")
        Integer usageLimitPerUser,

        Boolean active
) {}

