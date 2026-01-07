package com.samah.store.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SPA fallback controller for production deployments.
 * Forwards all non-API, non-static requests to index.html to support client-side routing.
 *
 * This ensures that direct navigation or page refresh on routes like /about, /products, etc.
 * will properly load the React application instead of returning 404.
 */
@Controller
public class SpaForwardController {

    /**
     * Forward all paths that don't match:
     * - /api/** (REST API)
     * - /swagger-ui/** (Swagger UI)
     * - /v3/api-docs/** (OpenAPI docs)
     * - /uploads/** (uploaded files)
     * - /assets/** (static assets)
     * - /static/** (static resources)
     * - Files with extensions (e.g., .js, .css, .png)
     *
     * Uses SecurityFilterChain and ResourceHandlers to exclude API/static paths,
     * then forwards remaining routes to index.html for client-side routing.
     */
    @RequestMapping(value = {
            "/",
            "/{x:[\\w\\-]+}",
            "/{x:^(?!api|swagger-ui|v3|uploads|assets|static).*}/{y:[\\w\\-]+}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}

