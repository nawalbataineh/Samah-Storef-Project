package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;

public record EmployeeOrderStatusRequest(@NotBlank String status) {}

