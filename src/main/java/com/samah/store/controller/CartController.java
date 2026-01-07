package com.samah.store.controller;

import com.samah.store.dto.CartDto;
import com.samah.store.dto.CartItemAddRequest;
import com.samah.store.dto.CartItemUpdateRequest;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public CartDto getCart(Authentication authentication) {
        Long userId = resolveUserId(authentication.getName());
        return cartService.getOrCreateCart(userId);
    }

    @PostMapping("/items")
    public CartDto addItem(Authentication authentication, @Valid @RequestBody CartItemAddRequest request) {
        Long userId = resolveUserId(authentication.getName());
        return cartService.addItem(userId, request.variantId(), request.quantity());
    }

    @PutMapping("/items/{variantId}")
    public CartDto updateItem(Authentication authentication, @PathVariable Long variantId, @Valid @RequestBody CartItemUpdateRequest request) {
        Long userId = resolveUserId(authentication.getName());
        return cartService.updateQuantity(userId, variantId, request.quantity());
    }

    @DeleteMapping("/items/{variantId}")
    public CartDto deleteItem(Authentication authentication, @PathVariable Long variantId) {
        Long userId = resolveUserId(authentication.getName());
        return cartService.removeItem(userId, variantId);
    }

    @DeleteMapping("/clear")
    public CartDto clear(Authentication authentication) {
        Long userId = resolveUserId(authentication.getName());
        return cartService.clear(userId);
    }

    private Long resolveUserId(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
