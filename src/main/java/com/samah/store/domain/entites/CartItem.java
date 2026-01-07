package com.samah.store.domain.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_cart_variant", columnNames = {"cart_id", "variant_id"}))
@Getter
@Setter
public class CartItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_cart_items_cart"))
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variant_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_cart_items_variant"))
    private ProductVariant variant;

    @Column(nullable = false)
    private Integer quantity;
}
