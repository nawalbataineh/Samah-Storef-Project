package com.samah.store.domain.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Single-row settings table for homepage hero section.
 * Always use id=1 or first row.
 */
@Entity
@Table(name = "hero_settings")
@Getter
@Setter
public class HeroSettings extends BaseEntity {

    @Column(nullable = false, length = 60)
    private String badgeText;

    @Column(nullable = false, length = 120)
    private String titleLine1;

    @Column(nullable = false, length = 120)
    private String titleLine2;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, length = 40)
    private String ctaText;

    @Column(nullable = false, length = 120)
    private String ctaLink;

    @Column(nullable = false, length = 500)
    private String heroImageUrl;
}

