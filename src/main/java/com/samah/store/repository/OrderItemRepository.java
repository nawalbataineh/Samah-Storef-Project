package com.samah.store.repository;

import com.samah.store.domain.entites.OrderItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @EntityGraph(attributePaths = {"variant", "variant.product"})
    List<OrderItem> findByOrderId(Long orderId);
}

