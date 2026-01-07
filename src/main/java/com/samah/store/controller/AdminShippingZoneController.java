package com.samah.store.controller;

import com.samah.store.dto.admin.AdminShippingZoneRequest;
import com.samah.store.dto.admin.AdminShippingZoneResponse;
import com.samah.store.service.AdminShippingZoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/shipping-zones")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminShippingZoneController {

    private final AdminShippingZoneService shippingZoneService;

    @GetMapping
    public ResponseEntity<Page<AdminShippingZoneResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(shippingZoneService.listZones(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminShippingZoneResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(shippingZoneService.getZoneById(id));
    }

    @PostMapping
    public ResponseEntity<AdminShippingZoneResponse> create(@Valid @RequestBody AdminShippingZoneRequest request) {
        AdminShippingZoneResponse created = shippingZoneService.createZone(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminShippingZoneResponse> update(@PathVariable Long id,
                                                            @Valid @RequestBody AdminShippingZoneRequest request) {
        return ResponseEntity.ok(shippingZoneService.updateZone(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        shippingZoneService.deleteZone(id);
        return ResponseEntity.noContent().build();
    }
}

