package com.samah.store.domain.entites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "admin_metric_config")
@Getter
@Setter
public class AdminMetricConfig {
    @Id
    private Long id = 1L; // Single row, always id = 1

    @Column(name = "revenue_reset_at")
    private Instant revenueResetAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}

