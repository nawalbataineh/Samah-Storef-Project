package com.samah.store.dto.admin;

import com.samah.store.domain.enums.CouponType;
import java.math.BigDecimal;
import java.time.Instant;

public record AdminCouponResponse(
        Long id,
        String code,
        CouponType type,
        BigDecimal value,
        BigDecimal minOrderTotal,
        Instant startAt,
        Instant endAt,
        Integer usageLimitTotal,
        Integer usageLimitPerUser,
        int usedCount,
        boolean active,
        boolean deleted,
        Instant createdAt,
        Instant updatedAt
) {}

