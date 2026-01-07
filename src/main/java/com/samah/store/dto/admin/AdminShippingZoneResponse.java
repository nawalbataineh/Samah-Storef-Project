package com.samah.store.dto.admin;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminShippingZoneResponse(
        Long id,
        String city,
        BigDecimal shippingFee,
        Instant createdAt,
        Instant updatedAt
) {}

