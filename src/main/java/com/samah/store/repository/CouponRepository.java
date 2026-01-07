package com.samah.store.repository;

import com.samah.store.domain.entites.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);

    @Query("select c from Coupon c where lower(c.code) = lower(:code) " +
            "and c.active = true and c.deleted = false " +
            "and (c.startAt is null or c.startAt <= :now) " +
            "and (c.endAt is null or c.endAt >= :now)")
    Optional<Coupon> findActiveValidCoupon(@Param("code") String code, @Param("now") Instant now);
}
