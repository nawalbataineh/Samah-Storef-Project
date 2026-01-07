package com.samah.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateEmployeeRequest(
        @NotBlank(message = "اسم المستخدم مطلوب")
        @Size(min = 3, max = 50, message = "اسم المستخدم يجب أن يكون بين 3 و 50 حرف")
        String username,

        @NotBlank(message = "البريد الإلكتروني مطلوب")
        @Email(message = "البريد الإلكتروني غير صالح")
        String email,

        @NotBlank(message = "كلمة المرور مطلوبة")
        @Size(min = 8, message = "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
        String password
) {}

