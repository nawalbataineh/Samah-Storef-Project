package com.samah.store.service.impl;

import com.samah.store.domain.entites.Coupon;
import com.samah.store.domain.enums.CouponType;
import com.samah.store.dto.CouponApplyResultDto;
import com.samah.store.dto.CouponDto;
import com.samah.store.exception.BadRequestException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.CouponRepository;
import com.samah.store.repository.CouponUsageRepository;
import com.samah.store.service.CouponService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    public CouponServiceImpl(CouponRepository couponRepository, CouponUsageRepository couponUsageRepository) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDto getByCode(String code) {
        Coupon coupon = couponRepository.findActiveValidCoupon(code.toUpperCase(), Instant.now())
                .orElseThrow(() -> new NotFoundException("Coupon not found or inactive"));
        return toDto(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponApplyResultDto validateAndCalculate(String code, Long customerId, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findActiveValidCoupon(code.toUpperCase(), Instant.now())
                .orElseThrow(() -> new NotFoundException("Coupon not found or inactive"));

        if (coupon.getMinOrderTotal() != null && subtotal.compareTo(coupon.getMinOrderTotal()) < 0) {
            throw new BadRequestException("Subtotal does not meet coupon minimum");
        }

        if (coupon.getUsageLimitTotal() != null && couponUsageRepository.countByCouponId(coupon.getId()) >= coupon.getUsageLimitTotal()) {
            throw new BadRequestException("Coupon usage limit reached");
        }
        if (coupon.getUsageLimitPerUser() != null && couponUsageRepository.countByCouponIdAndCustomerId(coupon.getId(), customerId) >= coupon.getUsageLimitPerUser()) {
            throw new BadRequestException("Coupon already used by this customer");
        }

        BigDecimal discount = calculateDiscount(coupon, subtotal);
        return new CouponApplyResultDto(coupon.getCode(), coupon.getType(), coupon.getValue(), discount, true);
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon.getType() == CouponType.PERCENT) {
            return subtotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100));
        }
        return coupon.getValue();
    }

    private CouponDto toDto(Coupon coupon) {
        return new CouponDto(coupon.getId(), coupon.getCode(), coupon.getType(), coupon.getValue(),
                coupon.getMinOrderTotal(), coupon.getStartAt(), coupon.getEndAt(),
                coupon.getUsageLimitTotal(), coupon.getUsageLimitPerUser(), coupon.isActive());
    }
}

