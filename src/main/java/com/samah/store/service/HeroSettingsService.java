package com.samah.store.service;

import com.samah.store.dto.HeroSettingsRequestDto;
import com.samah.store.dto.HeroSettingsResponseDto;

public interface HeroSettingsService {

    HeroSettingsResponseDto getPublicHero();

    HeroSettingsResponseDto getAdminHero();

    HeroSettingsResponseDto updateHero(HeroSettingsRequestDto dto);
}
