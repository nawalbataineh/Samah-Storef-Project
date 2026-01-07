package com.samah.store.dto;

import com.samah.store.domain.enums.CouponType;

import java.math.BigDecimal;
import java.time.Instant;

public record CouponDto(Long id, String code, CouponType type, BigDecimal value,
                        BigDecimal minOrderTotal, Instant startAt, Instant endAt,
                        Integer usageLimitTotal, Integer usageLimitPerUser, boolean active) {}

