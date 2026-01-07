package com.samah.store.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminMetricsDto(
        Long totalOrders,
        Long ordersToday,
        Long processingOrders,
        Long shippedOrders,
        Long deliveredOrders,
        Long cancelledOrders,
        BigDecimal revenueSinceReset,
        Instant revenueResetAt
) {
}

