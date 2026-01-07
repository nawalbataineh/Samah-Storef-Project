package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminOrderStatusUpdateRequest(
        @NotBlank String status
) {}
