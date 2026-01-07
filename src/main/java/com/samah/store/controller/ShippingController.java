package com.samah.store.controller;

import com.samah.store.domain.entites.User;
import com.samah.store.dto.ShippingQuoteDto;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.AddressRepository;
import com.samah.store.repository.ShippingZoneRepository;
import com.samah.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingZoneRepository shippingZoneRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @GetMapping("/quote")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ShippingQuoteDto> getQuote(
            @RequestParam Long addressId,
            @RequestParam(defaultValue = "0") BigDecimal orderTotal,
            Authentication auth) {

        Long userId = resolveUserId(auth);

        var address = addressRepository.findByIdAndCustomerId(addressId, userId)
                .orElseThrow(() -> new NotFoundException("Address not found"));

        var zone = shippingZoneRepository.findByCityIgnoreCase(address.getCity())
                .orElse(null);

        if (zone == null) {
            // Return default/fallback shipping
            return ResponseEntity.ok(new ShippingQuoteDto(
                    null,
                    "Standard Shipping",
                    new BigDecimal("5.00"),
                    "3-5 business days"
            ));
        }

        return ResponseEntity.ok(new ShippingQuoteDto(
                zone.getId(),
                zone.getCity(),
                zone.getShippingFee(),
                "2-4 business days"
        ));
    }

    @GetMapping("/zones")
    public ResponseEntity<?> listZones() {
        var zones = shippingZoneRepository.findAll();
        return ResponseEntity.ok(zones.stream().map(z ->
            new ShippingQuoteDto(z.getId(), z.getCity(), z.getShippingFee(), null)
        ).toList());
    }

    private Long resolveUserId(Authentication auth) {
        return userRepository.findByUsername(auth.getName())
                .map(User::getId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

