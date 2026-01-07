package com.samah.store.dto;

import java.math.BigDecimal;

public record ShippingQuoteDto(
        Long zoneId,
        String city,
        BigDecimal shippingFee,
        String estimatedDelivery
) {}

