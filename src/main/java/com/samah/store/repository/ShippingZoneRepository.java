package com.samah.store.repository;

import com.samah.store.domain.entites.ShippingZone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShippingZoneRepository extends JpaRepository<ShippingZone, Long> {
    Optional<ShippingZone> findByCityIgnoreCase(String city);
}

