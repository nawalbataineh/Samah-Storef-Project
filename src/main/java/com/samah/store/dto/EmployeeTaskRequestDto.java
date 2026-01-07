package com.samah.store.dto;

import com.samah.store.domain.enums.TaskPriority;
import com.samah.store.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record EmployeeTaskRequestDto(
        @NotBlank(message = "العنوان مطلوب")
        @Size(max = 200, message = "العنوان يجب ألا يتجاوز 200 حرف")
        String title,

        @Size(max = 1000, message = "الوصف يجب ألا يتجاوز 1000 حرف")
        String description,

        @NotNull(message = "الحالة مطلوبة")
        TaskStatus status,

        @NotNull(message = "الأولوية مطلوبة")
        TaskPriority priority,

        Instant dueAt,

        Long relatedOrderId
) {
}

