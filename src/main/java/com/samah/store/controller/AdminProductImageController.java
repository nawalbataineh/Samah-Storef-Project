package com.samah.store.controller;

import com.samah.store.dto.admin.AdminImageRequest;
import com.samah.store.dto.admin.AdminImageResponse;
import com.samah.store.service.AdminCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products/{productId}/images")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminProductImageController {

    private final AdminCatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<AdminImageResponse>> list(@PathVariable Long productId) {
        return ResponseEntity.ok(catalogService.listImagesByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<AdminImageResponse> add(@PathVariable Long productId,
                                                  @Valid @RequestBody AdminImageRequest request) {
        AdminImageResponse created = catalogService.addImage(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> remove(@PathVariable Long productId, @PathVariable Long imageId) {
        catalogService.removeImage(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}

