package com.samah.store.controller;

import com.samah.store.dto.CartDto;
import com.samah.store.dto.CouponApplyRequest;
import com.samah.store.dto.CouponApplyResultDto;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.CartService;
import com.samah.store.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@PreAuthorize("hasRole('CUSTOMER')")
public class CouponController {

    private final CouponService couponService;
    private final CartService cartService;
    private final UserRepository userRepository;

    public CouponController(CouponService couponService, CartService cartService, UserRepository userRepository) {
        this.couponService = couponService;
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @PostMapping("/apply")
    public CouponApplyResultDto apply(Authentication auth, @Valid @RequestBody CouponApplyRequest request) {
        Long userId = resolveUserId(auth.getName());
        BigDecimal subtotal = request.subtotal();
        if (subtotal == null) {
            CartDto cart = cartService.getOrCreateCart(userId);
            subtotal = cart.subtotal();
        }
        return couponService.validateAndCalculate(request.code(), userId, subtotal);
    }

    private Long resolveUserId(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
