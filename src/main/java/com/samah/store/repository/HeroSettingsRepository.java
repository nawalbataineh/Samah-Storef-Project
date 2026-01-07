package com.samah.store.repository;

import com.samah.store.domain.entites.HeroSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeroSettingsRepository extends JpaRepository<HeroSettings, Long> {
}

