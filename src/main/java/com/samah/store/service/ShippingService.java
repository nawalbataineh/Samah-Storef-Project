package com.samah.store.service;

import com.samah.store.dto.ShippingQuoteDto;
import org.springframework.transaction.annotation.Transactional;

public interface ShippingService {

    @Transactional(readOnly = true)
    ShippingQuoteDto resolveByCity(String city);
}

