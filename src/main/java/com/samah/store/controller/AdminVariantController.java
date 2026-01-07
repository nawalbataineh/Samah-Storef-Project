package com.samah.store.controller;

import com.samah.store.dto.admin.AdminVariantRequest;
import com.samah.store.dto.admin.AdminVariantResponse;
import com.samah.store.dto.admin.StockUpdateRequest;
import com.samah.store.service.AdminCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminVariantController {

    private final AdminCatalogService catalogService;

    @GetMapping("/products/{productId}/variants")
    public ResponseEntity<List<AdminVariantResponse>> listByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(catalogService.listVariantsByProduct(productId));
    }

    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<AdminVariantResponse> create(@PathVariable Long productId,
                                                       @Valid @RequestBody AdminVariantRequest request) {
        AdminVariantResponse created = catalogService.createVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<AdminVariantResponse> update(@PathVariable Long variantId,
                                                       @Valid @RequestBody AdminVariantRequest request) {
        return ResponseEntity.ok(catalogService.updateVariant(variantId, request));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> delete(@PathVariable Long variantId) {
        catalogService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/variants/{variantId}/stock")
    public ResponseEntity<AdminVariantResponse> updateStock(@PathVariable Long variantId,
                                                            @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(catalogService.updateStock(variantId, request.stockQuantity()));
    }
}

