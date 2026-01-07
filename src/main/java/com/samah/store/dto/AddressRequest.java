package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressRequest(
        @NotBlank String city,
        @NotBlank String street,
        String details,
                @NotBlank @Pattern(regexp = "[0-9+ \\-]{6,20}", message = "Phone number must be 6-20 characters and contain only digits, spaces, hyphens, and an optional leading plus sign") String phone
) {}
