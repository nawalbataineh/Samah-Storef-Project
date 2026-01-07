package com.samah.store.controller;

import com.samah.store.dto.EmployeeOrderStatusRequest;
import com.samah.store.dto.OrderDto;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee/orders")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public EmployeeOrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public Page<OrderDto> listMyOrders(Authentication auth, Pageable pageable) {
        Long employeeId = resolveUserId(auth.getName());
        return orderService.listEmployeeOrders(employeeId, pageable);
    }

    @GetMapping("/{id}")
    public OrderDto getOrder(Authentication auth, @PathVariable Long id) {
        Long employeeId = resolveUserId(auth.getName());
        return orderService.getEmployeeOrder(employeeId, id);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(Authentication auth, @PathVariable Long id, @Valid @RequestBody EmployeeOrderStatusRequest request) {
        Long employeeId = resolveUserId(auth.getName());
        return orderService.updateEmployeeOrderStatus(employeeId, id, request.status());
    }

    private Long resolveUserId(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

