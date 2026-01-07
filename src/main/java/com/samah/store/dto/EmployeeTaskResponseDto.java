package com.samah.store.dto;

import com.samah.store.domain.enums.TaskPriority;
import com.samah.store.domain.enums.TaskStatus;

import java.time.Instant;

public record EmployeeTaskResponseDto(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        Instant dueAt,
        Long relatedOrderId,
        Long assignedEmployeeId,
        String assignedEmployeeName,
        Instant createdAt,
        Instant updatedAt
) {
}

