package com.samah.store.service;

import com.samah.store.dto.OrderDto;
import com.samah.store.dto.OrderPlaceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface OrderService {

    @Transactional
    OrderDto placeOrder(Long customerId, OrderPlaceRequest request);

    @Transactional(readOnly = true)
    Page<OrderDto> listMyOrders(Long customerId, Pageable pageable);

    @Transactional(readOnly = true)
    OrderDto getMyOrder(Long customerId, Long orderId);

    @Transactional(readOnly = true)
    Page<OrderDto> listAll(Pageable pageable);

    @Transactional(readOnly = true)
    Page<OrderDto> listByDeliveredStatus(boolean delivered, Pageable pageable);

    @Transactional
    OrderDto updateStatus(Long orderId, String status);

    @Transactional
    OrderDto assignEmployee(Long orderId, Long employeeId);

    @Transactional(readOnly = true)
    Page<OrderDto> listEmployeeOrders(Long employeeId, Pageable pageable);

    @Transactional(readOnly = true)
    OrderDto getEmployeeOrder(Long employeeId, Long orderId);

    @Transactional
    OrderDto updateEmployeeOrderStatus(Long employeeId, Long orderId, String status);
}

