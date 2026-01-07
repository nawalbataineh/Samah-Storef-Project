package com.samah.store.controller;

import com.samah.store.dto.admin.AdminCouponRequest;
import com.samah.store.dto.admin.AdminCouponResponse;
import com.samah.store.service.AdminCouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupons")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminCouponController {

    private final AdminCouponService couponService;

    @GetMapping
    public ResponseEntity<Page<AdminCouponResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(couponService.listCoupons(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminCouponResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @PostMapping
    public ResponseEntity<AdminCouponResponse> create(@Valid @RequestBody AdminCouponRequest request) {
        AdminCouponResponse created = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminCouponResponse> update(@PathVariable Long id,
                                                      @Valid @RequestBody AdminCouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}

