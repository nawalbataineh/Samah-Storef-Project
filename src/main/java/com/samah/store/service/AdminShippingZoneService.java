package com.samah.store.service;

import com.samah.store.dto.admin.AdminShippingZoneRequest;
import com.samah.store.dto.admin.AdminShippingZoneResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminShippingZoneService {
    AdminShippingZoneResponse createZone(AdminShippingZoneRequest request);
    AdminShippingZoneResponse updateZone(Long id, AdminShippingZoneRequest request);
    void deleteZone(Long id);
    Page<AdminShippingZoneResponse> listZones(Pageable pageable);
    AdminShippingZoneResponse getZoneById(Long id);
}

