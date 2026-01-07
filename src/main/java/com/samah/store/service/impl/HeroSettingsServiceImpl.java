package com.samah.store.service.impl;

import com.samah.store.domain.entites.HeroSettings;
import com.samah.store.dto.HeroSettingsRequestDto;
import com.samah.store.dto.HeroSettingsResponseDto;
import com.samah.store.repository.HeroSettingsRepository;
import com.samah.store.service.HeroSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HeroSettingsServiceImpl implements HeroSettingsService {

    private final HeroSettingsRepository heroSettingsRepository;

    @Override
    public HeroSettingsResponseDto getPublicHero() {
        HeroSettings settings = getOrCreateDefaultSettings();
        return toDto(settings);
    }

    @Override
    public HeroSettingsResponseDto getAdminHero() {
        HeroSettings settings = getOrCreateDefaultSettings();
        return toDto(settings);
    }

    @Override
    public HeroSettingsResponseDto updateHero(HeroSettingsRequestDto dto) {
        HeroSettings settings = getOrCreateDefaultSettings();

        settings.setBadgeText(dto.badgeText());
        settings.setTitleLine1(dto.titleLine1());
        settings.setTitleLine2(dto.titleLine2());
        settings.setDescription(dto.description());
        settings.setCtaText(dto.ctaText());
        settings.setCtaLink(dto.ctaLink());
        settings.setHeroImageUrl(dto.heroImageUrl());

        HeroSettings saved = heroSettingsRepository.save(settings);
        return toDto(saved);
    }

    /**
     * Get the hero settings row, or create default if none exists.
     * This ensures we always have exactly one row (single-row settings pattern).
     */
    private HeroSettings getOrCreateDefaultSettings() {
        return heroSettingsRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    HeroSettings defaultSettings = new HeroSettings();
                    defaultSettings.setBadgeText("مجموعة جديدة");
                    defaultSettings.setTitleLine1("أناقة عصرية");
                    defaultSettings.setTitleLine2("بلمسة مميزة");
                    defaultSettings.setDescription("اكتشفي تشكيلتنا المختارة بعناية من الأزياء العصرية التي تعكس ذوقك الراقي");
                    defaultSettings.setCtaText("تسوّقي الآن");
                    defaultSettings.setCtaLink("/products");
                    defaultSettings.setHeroImageUrl("/assets/heroImage.jpg");
                    return heroSettingsRepository.save(defaultSettings);
                });
    }

    private HeroSettingsResponseDto toDto(HeroSettings settings) {
        return new HeroSettingsResponseDto(
                settings.getId(),
                settings.getBadgeText(),
                settings.getTitleLine1(),
                settings.getTitleLine2(),
                settings.getDescription(),
                settings.getCtaText(),
                settings.getCtaLink(),
                settings.getHeroImageUrl(),
                settings.getUpdatedAt()
        );
    }
}

