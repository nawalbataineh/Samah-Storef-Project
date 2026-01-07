package com.samah.store.controller;

import com.samah.store.dto.CategoryDto;
import com.samah.store.dto.ProductDto;
import com.samah.store.dto.ProductSummaryDto;
import com.samah.store.service.CategoryService;
import com.samah.store.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicCatalogController {

    private final CategoryService categoryService;
    private final ProductService productService;

    public PublicCatalogController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping("/categories")
    public List<CategoryDto> listCategories() {
        return categoryService.listPublic();
    }

    @GetMapping("/products")
    public Page<ProductSummaryDto> searchProducts(@RequestParam(required = false) String q,
                                                  @RequestParam(required = false) Long categoryId,
                                                  @RequestParam(required = false) Double minPrice,
                                                  @RequestParam(required = false) Double maxPrice,
                                                  Pageable pageable) {
        return productService.search(q, categoryId, minPrice, maxPrice, pageable);
    }

    @GetMapping("/products/{slug}")
    public ProductDto getProduct(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
