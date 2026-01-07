package com.samah.store.domain.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
public class Address extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_addresses_customer"))
    private User customer;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, length = 120)
    private String street;

    @Column(length = 120)
    private String details;

    @Column(nullable = false, length = 20)
    private String phone;
}
