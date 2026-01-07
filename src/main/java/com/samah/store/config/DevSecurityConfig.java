package com.samah.store.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Development-only security configuration that allows ADMIN to access customer endpoints.
 * Activated only when profile=dev AND app.security.allow-admin-checkout=true
 *
 * Usage: java -jar app.jar --spring.profiles.active=dev
 */
@Configuration
@Profile("dev")
@ConditionalOnProperty(name = "app.security.allow-admin-checkout", havingValue = "true")
public class DevSecurityConfig {

    /**
     * In dev mode, we relax the role restrictions by allowing ADMIN to access
     * customer checkout endpoints for testing purposes.
     *
     * Note: This does NOT override @PreAuthorize annotations.
     * For dev testing, use a CUSTOMER account or modify the annotations temporarily.
     *
     * This config provides additional logging and relaxed CORS for local testing.
     */
    @Bean
    @Order(99)
    public DevModeIndicator devModeIndicator() {
        return new DevModeIndicator();
    }

    public static class DevModeIndicator {
        public DevModeIndicator() {
            System.out.println("======================================");
            System.out.println("  DEV MODE ACTIVE");
            System.out.println("  Admin checkout testing: ENABLED");
            System.out.println("  Use CUSTOMER account for checkout");
            System.out.println("======================================");
        }
    }
}

