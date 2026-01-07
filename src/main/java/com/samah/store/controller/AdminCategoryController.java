package com.samah.store.controller;

import com.samah.store.dto.admin.AdminCategoryRequest;
import com.samah.store.dto.admin.AdminCategoryResponse;
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
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCatalogService catalogService;

    @GetMapping
    public ResponseEntity<Page<AdminCategoryResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(catalogService.listCategories(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<AdminCategoryResponse> create(@Valid @RequestBody AdminCategoryRequest request) {
        AdminCategoryResponse created = catalogService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse> update(@PathVariable Long id,
                                                        @Valid @RequestBody AdminCategoryRequest request) {
        return ResponseEntity.ok(catalogService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        catalogService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deletePermanently(@PathVariable Long id) {
        catalogService.deleteCategoryPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminCategoryResponse> toggleStatus(@PathVariable Long id,
                                                               @RequestParam Boolean active) {
        return ResponseEntity.ok(catalogService.toggleCategoryStatus(id, active));
    }
}

