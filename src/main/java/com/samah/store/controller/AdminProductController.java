package com.samah.store.controller;

import com.samah.store.dto.admin.AdminProductListItem;
import com.samah.store.dto.admin.AdminProductRequest;
import com.samah.store.dto.admin.AdminProductResponse;
import com.samah.store.service.AdminCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminCatalogService catalogService;

    @GetMapping
    public ResponseEntity<Page<AdminProductListItem>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean active,
            Pageable pageable) {
        return ResponseEntity.ok(catalogService.listProducts(categoryId, q, active, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<AdminProductResponse> create(@Valid @RequestBody AdminProductRequest request) {
        AdminProductResponse created = catalogService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminProductResponse> update(@PathVariable Long id,
                                                       @Valid @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(catalogService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        catalogService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deletePermanently(@PathVariable Long id) {
        catalogService.deleteProductPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminProductResponse> toggleStatus(@PathVariable Long id,
                                                              @RequestParam Boolean active) {
        return ResponseEntity.ok(catalogService.toggleProductStatus(id, active));
    }
}

