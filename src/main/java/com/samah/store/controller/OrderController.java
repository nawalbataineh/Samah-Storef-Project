package com.samah.store.controller;

import com.samah.store.dto.AdminOrderStatusUpdateRequest;
import com.samah.store.dto.OrderDto;
import com.samah.store.dto.OrderPlaceRequest;
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
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderDto placeOrder(Authentication auth, @Valid @RequestBody OrderPlaceRequest request) {
        Long userId = resolveUserId(auth.getName());
        return orderService.placeOrder(userId, request);
    }

    @GetMapping("/orders/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Page<OrderDto> myOrders(Authentication auth, Pageable pageable) {
        Long userId = resolveUserId(auth.getName());
        return orderService.listMyOrders(userId, pageable);
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderDto myOrder(Authentication auth, @PathVariable Long id) {
        Long userId = resolveUserId(auth.getName());
        return orderService.getMyOrder(userId, id);
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<OrderDto> adminOrders(@RequestParam(required = false) Boolean delivered, Pageable pageable) {
        if (delivered != null) {
            return orderService.listByDeliveredStatus(delivered, pageable);
        }
        return orderService.listAll(pageable);
    }

    @PatchMapping("/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDto updateStatus(@PathVariable Long id, @Valid @RequestBody AdminOrderStatusUpdateRequest request) {
        return orderService.updateStatus(id, request.status());
    }

    private Long resolveUserId(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
