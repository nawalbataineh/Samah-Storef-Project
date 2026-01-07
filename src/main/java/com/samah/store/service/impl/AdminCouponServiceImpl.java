package com.samah.store.service.impl;

import com.samah.store.domain.entites.Coupon;
import com.samah.store.dto.admin.AdminCouponRequest;
import com.samah.store.dto.admin.AdminCouponResponse;
import com.samah.store.exception.ConflictException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.CouponRepository;
import com.samah.store.repository.CouponUsageRepository;
import com.samah.store.service.AdminCouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminCouponServiceImpl implements AdminCouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Override
    @Transactional
    public AdminCouponResponse createCoupon(AdminCouponRequest request) {
        // Check for duplicate code
        Optional<Coupon> existing = couponRepository.findByCodeIgnoreCase(request.code());
        if (existing.isPresent()) {
            throw new ConflictException("Coupon code '" + request.code() + "' already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.code().toUpperCase());
        coupon.setType(request.type());
        coupon.setValue(request.value());
        coupon.setMinOrderTotal(request.minOrderTotal());
        coupon.setStartAt(request.startAt());
        coupon.setEndAt(request.endAt());
        coupon.setUsageLimitTotal(request.usageLimitTotal());
        coupon.setUsageLimitPerUser(request.usageLimitPerUser());
        coupon.setActive(request.active() != null ? request.active() : true);

        Coupon saved = couponRepository.save(coupon);
        return mapToResponse(saved, 0);
    }

    @Override
    @Transactional
    public AdminCouponResponse updateCoupon(Long id, AdminCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coupon not found with id: " + id));

        // Check code uniqueness if changed
        if (!coupon.getCode().equalsIgnoreCase(request.code())) {
            Optional<Coupon> existing = couponRepository.findByCodeIgnoreCase(request.code());
            if (existing.isPresent()) {
                throw new ConflictException("Coupon code '" + request.code() + "' already exists");
            }
        }

        coupon.setCode(request.code().toUpperCase());
        coupon.setType(request.type());
        coupon.setValue(request.value());
        coupon.setMinOrderTotal(request.minOrderTotal());
        coupon.setStartAt(request.startAt());
        coupon.setEndAt(request.endAt());
        coupon.setUsageLimitTotal(request.usageLimitTotal());
        coupon.setUsageLimitPerUser(request.usageLimitPerUser());
        if (request.active() != null) {
            coupon.setActive(request.active());
        }

        Coupon saved = couponRepository.save(coupon);
        int usedCount = countCouponUsage(id);
        return mapToResponse(saved, usedCount);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coupon not found with id: " + id));

        // Soft delete
        coupon.setDeleted(true);
        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCouponResponse> listCoupons(Pageable pageable) {
        return couponRepository.findAll(pageable).map(c -> {
            int usedCount = countCouponUsage(c.getId());
            return mapToResponse(c, usedCount);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public AdminCouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coupon not found with id: " + id));
        int usedCount = countCouponUsage(id);
        return mapToResponse(coupon, usedCount);
    }

    private int countCouponUsage(Long couponId) {
        return (int) couponUsageRepository.countByCouponId(couponId);
    }

    private AdminCouponResponse mapToResponse(Coupon c, int usedCount) {
        return new AdminCouponResponse(
                c.getId(),
                c.getCode(),
                c.getType(),
                c.getValue(),
                c.getMinOrderTotal(),
                c.getStartAt(),
                c.getEndAt(),
                c.getUsageLimitTotal(),
                c.getUsageLimitPerUser(),
                usedCount,
                c.isActive(),
                c.isDeleted(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}

