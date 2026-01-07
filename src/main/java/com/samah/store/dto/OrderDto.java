package com.samah.store.dto;

import com.samah.store.domain.enums.OrderStatus;
import com.samah.store.domain.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDto(
        Long id,
        OrderStatus status,
        PaymentMethod paymentMethod,
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discountTotal,
        BigDecimal total,
        String trackingCode,
        CustomerInfoDto customer,
        AddressDto address,
        AssignedEmployeeDto assignedEmployee,
        List<OrderItemDto> items,
        Instant createdAt
) {}


