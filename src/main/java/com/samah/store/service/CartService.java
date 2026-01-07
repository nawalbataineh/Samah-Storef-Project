package com.samah.store.service;

import com.samah.store.dto.CartDto;
import org.springframework.transaction.annotation.Transactional;

public interface CartService {

    @Transactional(readOnly = true)
    CartDto getOrCreateCart(Long customerId);

    @Transactional
    CartDto addItem(Long customerId, Long variantId, int quantity);

    @Transactional
    CartDto updateQuantity(Long customerId, Long variantId, int quantity);

    @Transactional
    CartDto removeItem(Long customerId, Long variantId);

    @Transactional
    CartDto clear(Long customerId);
}

