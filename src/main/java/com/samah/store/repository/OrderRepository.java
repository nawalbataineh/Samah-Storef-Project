package com.samah.store.repository;

import com.samah.store.domain.entites.Order;
import com.samah.store.domain.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    @EntityGraph(attributePaths = {"address", "customer", "assignedEmployee"})
    Page<Order> findAllBy(Pageable pageable);

    @EntityGraph(attributePaths = {"address", "customer"})
    Optional<Order> findWithCustomerAndAddressById(Long id);

    Page<Order> findByAssignedEmployeeId(Long employeeId, Pageable pageable);

    @EntityGraph(attributePaths = {"address", "customer", "assignedEmployee"})
    Optional<Order> findWithDetailsById(Long id);

    long countByStatus(OrderStatus status);

    long countByCreatedAtAfter(Instant after);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status = 'DELIVERED' AND o.createdAt >= :since")
    BigDecimal sumRevenueSince(@Param("since") Instant since);

    @EntityGraph(attributePaths = {"customer", "assignedEmployee"})
    Page<Order> findByStatusNot(OrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "assignedEmployee", "address"})
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "assignedEmployee", "address"})
    Page<Order> findByStatusIn(java.util.List<OrderStatus> statuses, Pageable pageable);
}
