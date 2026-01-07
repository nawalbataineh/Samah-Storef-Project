package com.samah.store.service.impl;

import com.samah.store.domain.entites.AdminMetricConfig;
import com.samah.store.domain.enums.OrderStatus;
import com.samah.store.dto.AdminMetricsDto;
import com.samah.store.repository.AdminMetricConfigRepository;
import com.samah.store.repository.OrderRepository;
import com.samah.store.service.AdminMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AdminMetricsServiceImpl implements AdminMetricsService {

    private final OrderRepository orderRepository;
    private final AdminMetricConfigRepository metricConfigRepository;

    @Override
    public AdminMetricsDto getMetrics() {
        AdminMetricConfig config = getOrCreateConfig();

        // Get today's start time
        Instant todayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);

        // Calculate revenue since reset
        BigDecimal revenue;
        if (config.getRevenueResetAt() != null) {
            revenue = orderRepository.sumRevenueSince(config.getRevenueResetAt());
        } else {
            revenue = orderRepository.sumTotalRevenue();
        }

        return new AdminMetricsDto(
                orderRepository.count(),
                orderRepository.countByCreatedAtAfter(todayStart),
                orderRepository.countByStatus(OrderStatus.PROCESSING),
                orderRepository.countByStatus(OrderStatus.SHIPPED),
                orderRepository.countByStatus(OrderStatus.DELIVERED),
                orderRepository.countByStatus(OrderStatus.CANCELLED),
                revenue,
                config.getRevenueResetAt()
        );
    }

    @Override
    @Transactional
    public void resetRevenue() {
        AdminMetricConfig config = getOrCreateConfig();
        config.setRevenueResetAt(Instant.now());
        metricConfigRepository.save(config);
    }

    private AdminMetricConfig getOrCreateConfig() {
        return metricConfigRepository.findById(1L)
                .orElseGet(() -> {
                    AdminMetricConfig config = new AdminMetricConfig();
                    config.setId(1L);
                    return metricConfigRepository.save(config);
                });
    }
}

