package com.samah.store.service.impl;

import com.samah.store.domain.entites.ShippingZone;
import com.samah.store.dto.admin.AdminShippingZoneRequest;
import com.samah.store.dto.admin.AdminShippingZoneResponse;
import com.samah.store.exception.ConflictException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.ShippingZoneRepository;
import com.samah.store.service.AdminShippingZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminShippingZoneServiceImpl implements AdminShippingZoneService {

    private final ShippingZoneRepository shippingZoneRepository;

    @Override
    @Transactional
    public AdminShippingZoneResponse createZone(AdminShippingZoneRequest request) {
        // Check for duplicate city
        Optional<ShippingZone> existing = shippingZoneRepository.findByCityIgnoreCase(request.city());
        if (existing.isPresent()) {
            throw new ConflictException("Shipping zone for city '" + request.city() + "' already exists");
        }

        ShippingZone zone = new ShippingZone();
        zone.setCity(request.city());
        zone.setShippingFee(request.shippingFee());

        ShippingZone saved = shippingZoneRepository.save(zone);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AdminShippingZoneResponse updateZone(Long id, AdminShippingZoneRequest request) {
        ShippingZone zone = shippingZoneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Shipping zone not found with id: " + id));

        // Check for duplicate city if changed
        if (!zone.getCity().equalsIgnoreCase(request.city())) {
            Optional<ShippingZone> existing = shippingZoneRepository.findByCityIgnoreCase(request.city());
            if (existing.isPresent()) {
                throw new ConflictException("Shipping zone for city '" + request.city() + "' already exists");
            }
        }

        zone.setCity(request.city());
        zone.setShippingFee(request.shippingFee());

        ShippingZone saved = shippingZoneRepository.save(zone);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteZone(Long id) {
        ShippingZone zone = shippingZoneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Shipping zone not found with id: " + id));
        shippingZoneRepository.delete(zone);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminShippingZoneResponse> listZones(Pageable pageable) {
        return shippingZoneRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminShippingZoneResponse getZoneById(Long id) {
        ShippingZone zone = shippingZoneRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Shipping zone not found with id: " + id));
        return mapToResponse(zone);
    }

    private AdminShippingZoneResponse mapToResponse(ShippingZone z) {
        return new AdminShippingZoneResponse(
                z.getId(),
                z.getCity(),
                z.getShippingFee(),
                z.getCreatedAt(),
                z.getUpdatedAt()
        );
    }
}

