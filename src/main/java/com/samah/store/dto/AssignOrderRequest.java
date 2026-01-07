package com.samah.store.dto;

import jakarta.validation.constraints.NotNull;

public record AssignOrderRequest(@NotNull Long employeeId) {}

