package com.samah.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record HeroSettingsRequestDto(
        @NotBlank(message = "نص الشارة مطلوب")
        @Size(max = 60, message = "نص الشارة يجب ألا يتجاوز 60 حرف")
        String badgeText,

        @NotBlank(message = "السطر الأول من العنوان مطلوب")
        @Size(max = 120, message = "السطر الأول يجب ألا يتجاوز 120 حرف")
        String titleLine1,

        @NotBlank(message = "السطر الثاني من العنوان مطلوب")
        @Size(max = 120, message = "السطر الثاني يجب ألا يتجاوز 120 حرف")
        String titleLine2,

        @NotBlank(message = "الوصف مطلوب")
        @Size(max = 500, message = "الوصف يجب ألا يتجاوز 500 حرف")
        String description,

        @NotBlank(message = "نص زر الحث على الإجراء مطلوب")
        @Size(max = 40, message = "نص الزر يجب ألا يتجاوز 40 حرف")
        String ctaText,

        @NotBlank(message = "رابط زر الحث على الإجراء مطلوب")
        @Size(max = 120, message = "الرابط يجب ألا يتجاوز 120 حرف")
        @Pattern(regexp = "^/.*", message = "الرابط يجب أن يبدأ بـ /")
        String ctaLink,

        @NotBlank(message = "رابط صورة الهيرو مطلوب")
        @Size(max = 500, message = "رابط الصورة يجب ألا يتجاوز 500 حرف")
        String heroImageUrl
) {
}


