package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressRequest(
        @NotBlank String city,
        @NotBlank String street,
        String details,
        @NotBlank @Pattern(regexp = "^[0-9]{6,15}$", message = "رقم الهاتف غير صالح") String phone
) {}
