package com.samah.store.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AdminImageRequest(
        @NotBlank(message = "Image URL is required")
        String url,

        @Min(value = 0, message = "Sort order cannot be negative")
        Integer sortOrder
) {}

