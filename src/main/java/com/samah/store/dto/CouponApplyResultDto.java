package com.samah.store.dto;

import com.samah.store.domain.enums.CouponType;

import java.math.BigDecimal;

public record CouponApplyResultDto(String code, CouponType type, BigDecimal value,
                                   BigDecimal discount, boolean applied) {}

