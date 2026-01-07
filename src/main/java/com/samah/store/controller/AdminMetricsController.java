package com.samah.store.controller;

import com.samah.store.dto.AdminMetricsDto;
import com.samah.store.service.AdminMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/metrics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminMetricsController {

    private final AdminMetricsService metricsService;

    @GetMapping
    public ResponseEntity<AdminMetricsDto> getMetrics() {
        return ResponseEntity.ok(metricsService.getMetrics());
    }

    @PostMapping("/revenue-reset")
    public ResponseEntity<Void> resetRevenue() {
        metricsService.resetRevenue();
        return ResponseEntity.ok().build();
    }
}

