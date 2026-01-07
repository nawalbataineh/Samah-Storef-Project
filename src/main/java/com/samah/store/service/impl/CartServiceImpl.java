package com.samah.store.service.impl;

import com.samah.store.domain.entites.Cart;
import com.samah.store.domain.entites.CartItem;
import com.samah.store.domain.entites.ProductVariant;
import com.samah.store.domain.entites.User;
import com.samah.store.dto.CartDto;
import com.samah.store.dto.CartItemDto;
import com.samah.store.dto.ProductVariantDto;
import com.samah.store.exception.BadRequestException;
import com.samah.store.exception.ForbiddenException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.CartItemRepository;
import com.samah.store.repository.CartRepository;
import com.samah.store.repository.ProductVariantRepository;
import com.samah.store.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductVariantRepository productVariantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Override
    @Transactional
    public CartDto getOrCreateCart(Long customerId) {
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseGet(() -> createCart(customerId));
        enforceOwnership(cart, customerId);
        List<CartItem> items = cart.getItems() != null ? cart.getItems() : Collections.emptyList();
        return toDto(cart, items);
    }

    private Cart createCart(Long customerId) {
        Cart c = new Cart();
        User userRef = new User();
        userRef.setId(customerId);
        c.setCustomer(userRef);
        c.setItems(new java.util.ArrayList<>());
        return cartRepository.save(c);
    }

    @Override
    @Transactional
    public CartDto addItem(Long customerId, Long variantId, int quantity) {
        if (quantity <= 0) throw new BadRequestException("Quantity must be > 0");
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseGet(() -> createCart(customerId));
        enforceOwnership(cart, customerId);

        ProductVariant variant = productVariantRepository.findByIdAndActiveIsTrueAndDeletedIsFalse(variantId)
                .orElseThrow(() -> new NotFoundException("Variant not found or inactive"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst()
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setCart(cart);
                    ci.setVariant(variant);
                    ci.setQuantity(0);
                    cart.getItems().add(ci);
                    return ci;
                });
        item.setQuantity(item.getQuantity() + quantity);
        cartRepository.save(cart);
        return toDto(cart, cart.getItems());
    }

    @Override
    @Transactional
    public CartDto updateQuantity(Long customerId, Long variantId, int quantity) {
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));
        enforceOwnership(cart, customerId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getVariant().getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Item not found in cart"));
        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }
        cartRepository.save(cart);
        return toDto(cart, cart.getItems());
    }

    @Override
    @Transactional
    public CartDto removeItem(Long customerId, Long variantId) {
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));
        enforceOwnership(cart, customerId);
        cart.getItems().removeIf(i -> i.getVariant().getId().equals(variantId));
        cartRepository.save(cart);
        return toDto(cart, cart.getItems());
    }

    @Override
    @Transactional
    public CartDto clear(Long customerId) {
        Cart cart = cartRepository.findWithItemsByCustomerId(customerId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));
        enforceOwnership(cart, customerId);
        cart.getItems().clear();
        cartRepository.save(cart);
        return toDto(cart, cart.getItems());
    }

    private void enforceOwnership(Cart cart, Long customerId) {
        if (cart.getCustomer() != null && cart.getCustomer().getId() != null && !cart.getCustomer().getId().equals(customerId)) {
            throw new ForbiddenException("Cart does not belong to user");
        }
        if (cart.getCustomer() == null) {
            User userRef = new User();
            userRef.setId(customerId);
            cart.setCustomer(userRef);
        }
    }

    private CartDto toDto(Cart cart, List<CartItem> items) {
        List<CartItemDto> itemDtos = items.stream().map(i -> {
            ProductVariant v = i.getVariant();
            ProductVariantDto variantDto = new ProductVariantDto(v.getId(), v.getSku(), v.getSize(), v.getColor(), v.getPrice(), v.getStockQuantity(), v.isActive(), v.isDeleted());
            BigDecimal lineTotal = v.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
            return new CartItemDto(i.getId(), variantDto, i.getQuantity(), lineTotal);
        }).toList();
        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartDto(cart.getId(), itemDtos, subtotal);
    }
}
