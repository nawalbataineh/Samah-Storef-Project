package com.samah.store.service;

import com.samah.store.dto.CouponApplyResultDto;
import com.samah.store.dto.CouponDto;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

public interface CouponService {

    @Transactional(readOnly = true)
    CouponDto getByCode(String code);

    @Transactional(readOnly = true)
    CouponApplyResultDto validateAndCalculate(String code, Long customerId, BigDecimal subtotal);
}

