package com.samah.store.repository;

import com.samah.store.domain.entites.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomerId(Long customerId);

    @EntityGraph(attributePaths = {"customer"})
    Optional<Cart> findWithCustomerByCustomerId(Long customerId);

    @EntityGraph(attributePaths = {"customer", "items", "items.variant", "items.variant.product"})
    Optional<Cart> findWithItemsByCustomerId(Long customerId);
}
