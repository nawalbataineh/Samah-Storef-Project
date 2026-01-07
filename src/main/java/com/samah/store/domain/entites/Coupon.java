package com.samah.store.domain.entites;

import com.samah.store.domain.enums.CouponType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "coupons",
        uniqueConstraints = @UniqueConstraint(name = "uk_coupons_code", columnNames = "code"))
@Getter
@Setter
public class Coupon extends BaseEntity {
    @Column(nullable = false, length = 40)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private CouponType type;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal value;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderTotal;

    private Instant startAt;
    private Instant endAt;

    private Integer usageLimitTotal;
    private Integer usageLimitPerUser;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean deleted = false;
}
