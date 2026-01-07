package com.samah.store.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminCategoryRequest(
        @NotBlank(message = "Category name is required")
        @Size(max = 80, message = "Category name must not exceed 80 characters")
        String name,

        @Size(max = 120, message = "Slug must not exceed 120 characters")
        String slug,

        Boolean active
) {}

