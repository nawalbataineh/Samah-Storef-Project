package com.samah.store.service;

import com.samah.store.dto.HeroSettingsRequestDto;
import com.samah.store.dto.HeroSettingsResponseDto;
import org.springframework.transaction.annotation.Transactional;

public interface HeroSettingsService {

    @Transactional(readOnly = true)
    HeroSettingsResponseDto getPublicHero();

    @Transactional(readOnly = true)
    HeroSettingsResponseDto getAdminHero();

    @Transactional
    HeroSettingsResponseDto updateHero(HeroSettingsRequestDto dto);
}

