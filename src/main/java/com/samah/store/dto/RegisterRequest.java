package com.samah.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min=3, max=50) String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min=8, max=100) String password,
        @NotBlank @Pattern(regexp = "^[0-9]{6,15}$", message = "رقم الهاتف غير صالح") String phone) {
}
