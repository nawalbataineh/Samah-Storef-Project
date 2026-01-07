package com.samah.store.repository;

import com.samah.store.domain.entites.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    Optional<CouponUsage> findByCouponIdAndCustomerIdAndOrderId(Long couponId, Long customerId, Long orderId);
    List<CouponUsage> findByCustomerId(Long customerId);
    long countByCouponId(Long couponId);
    long countByCouponIdAndCustomerId(Long couponId, Long customerId);
}
