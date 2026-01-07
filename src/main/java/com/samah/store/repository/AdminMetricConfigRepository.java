package com.samah.store.repository;

import com.samah.store.domain.entites.AdminMetricConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminMetricConfigRepository extends JpaRepository<AdminMetricConfig, Long> {
}
