package com.samah.store.controller;

import com.samah.store.domain.enums.Role;
import com.samah.store.dto.AssignOrderRequest;
import com.samah.store.dto.EmployeeInfoDto;
import com.samah.store.dto.OrderDto;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployeeController {

    private final UserRepository userRepository;
    private final OrderService orderService;

    public AdminEmployeeController(UserRepository userRepository, OrderService orderService) {
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    @GetMapping("/employees")
    public List<EmployeeInfoDto> listEmployees() {
        return userRepository.findByRole(Role.EMPLOYEE).stream()
                .map(u -> new EmployeeInfoDto(u.getId(), u.getUsername(), u.getEmail(), u.isEnabled()))
                .toList();
    }

    @PatchMapping("/orders/{id}/assign")
    public OrderDto assignOrder(@PathVariable Long id, @Valid @RequestBody AssignOrderRequest request) {
        return orderService.assignEmployee(id, request.employeeId());
    }
}

