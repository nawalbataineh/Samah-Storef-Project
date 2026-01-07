package com.samah.store.service.impl;

import com.samah.store.domain.entites.ShippingZone;
import com.samah.store.dto.ShippingQuoteDto;
import com.samah.store.repository.ShippingZoneRepository;
import com.samah.store.service.ShippingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ShippingServiceImpl implements ShippingService {

    private final ShippingZoneRepository shippingZoneRepository;

    public ShippingServiceImpl(ShippingZoneRepository shippingZoneRepository) {
        this.shippingZoneRepository = shippingZoneRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ShippingQuoteDto resolveByCity(String city) {
        if (city == null || city.isBlank()) {
            return new ShippingQuoteDto(null, null, BigDecimal.ZERO, null);
        }
        return shippingZoneRepository.findByCityIgnoreCase(city)
                .map(z -> new ShippingQuoteDto(z.getId(), z.getCity(), z.getShippingFee(), "2-3 أيام عمل"))
                .orElseGet(() -> new ShippingQuoteDto(null, city, BigDecimal.ZERO, null));
    }
}

