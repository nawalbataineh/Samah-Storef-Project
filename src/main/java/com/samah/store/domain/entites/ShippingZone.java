package com.samah.store.domain.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "shipping_zones",
        uniqueConstraints = @UniqueConstraint(name = "uk_shipping_city", columnNames = "city"))
@Getter
@Setter
public class ShippingZone extends BaseEntity {
    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingFee;
}
