package com.samah.store.repository;

import com.samah.store.domain.entites.HeroSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeroSettingsRepository extends JpaRepository<HeroSettings, Long> {
    // Efficient single-row fetch: return first/top row by id if present
    Optional<HeroSettings> findTopByOrderByIdAsc();
}
