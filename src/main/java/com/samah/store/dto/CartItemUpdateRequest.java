package com.samah.store.dto;

import jakarta.validation.constraints.Min;

public record CartItemUpdateRequest(
        @Min(0) int quantity
) {}
