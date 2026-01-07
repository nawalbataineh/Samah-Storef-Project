package com.samah.store.service;

import com.samah.store.dto.AdminMetricsDto;
import org.springframework.transaction.annotation.Transactional;

public interface AdminMetricsService {
    @Transactional(readOnly = true)
    AdminMetricsDto getMetrics();

    @Transactional
    void resetRevenue();
}

