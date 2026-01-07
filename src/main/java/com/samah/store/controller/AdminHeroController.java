package com.samah.store.controller;

import com.samah.store.dto.HeroSettingsRequestDto;
import com.samah.store.dto.HeroSettingsResponseDto;
import com.samah.store.service.HeroSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/hero")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminHeroController {

    private final HeroSettingsService heroSettingsService;

    @GetMapping
    public ResponseEntity<HeroSettingsResponseDto> getHero() {
        return ResponseEntity.ok(heroSettingsService.getAdminHero());
    }

    @PutMapping
    public ResponseEntity<HeroSettingsResponseDto> updateHero(@Valid @RequestBody HeroSettingsRequestDto request) {
        HeroSettingsResponseDto updated = heroSettingsService.updateHero(request);
        return ResponseEntity.ok(updated);
    }
}

