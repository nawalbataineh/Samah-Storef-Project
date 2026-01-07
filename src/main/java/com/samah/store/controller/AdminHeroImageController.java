package com.samah.store.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/hero")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminHeroImageController {

    @Value("${app.upload.dir:uploads}")
    private String uploadBaseDir;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadHeroImage(@RequestParam("file") MultipartFile file) {
        // Validate file is not empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "الملف فارغ"));
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "حجم الملف يجب ألا يتجاوز 5 ميجابايت"));
        }

        // Get file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ResponseEntity.badRequest().body(Map.of("error", "اسم الملف غير صحيح"));
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

        // Validate extension
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return ResponseEntity.badRequest().body(Map.of("error", "نوع الملف غير مدعوم. المسموح: png, jpg, jpeg, webp"));
        }

        try {
            // Create hero directory if not exists
            Path heroDir = Paths.get(uploadBaseDir, "hero");
            Files.createDirectories(heroDir);

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + "." + extension;
            Path targetPath = heroDir.resolve(uniqueFilename);

            // Save file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return URL
            String url = "/uploads/hero/" + uniqueFilename;
            return ResponseEntity.ok(Map.of("url", url));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "فشل في رفع الملف: " + e.getMessage()));
        }
    }
}

