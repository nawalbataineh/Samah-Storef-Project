package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record CouponApplyRequest(
        @NotBlank String code,
        @PositiveOrZero BigDecimal subtotal
) {}
