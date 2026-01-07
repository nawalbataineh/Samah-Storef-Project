package com.samah.store.service;

import com.samah.store.dto.admin.AdminCouponRequest;
import com.samah.store.dto.admin.AdminCouponResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminCouponService {
    AdminCouponResponse createCoupon(AdminCouponRequest request);
    AdminCouponResponse updateCoupon(Long id, AdminCouponRequest request);
    void deleteCoupon(Long id);
    Page<AdminCouponResponse> listCoupons(Pageable pageable);
    AdminCouponResponse getCouponById(Long id);
}

