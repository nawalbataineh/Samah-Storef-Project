package com.samah.store.domain.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "coupon_usages",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_coupon_user_order",
                columnNames = {"coupon_id", "customer_id", "order_id"}
        ))
@Getter
@Setter
public class CouponUsage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coupon_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_coupon_usage_coupon"))
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_coupon_usage_customer"))
    private User customer;

    @Column(nullable = false)
    private Long orderId; // نخزن order id بدون علاقة مباشرة لتخفيف التعقيد

    @Column(nullable = false)
    private Instant usedAt = Instant.now();
}
