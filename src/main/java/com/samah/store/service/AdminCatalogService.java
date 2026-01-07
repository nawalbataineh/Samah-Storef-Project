package com.samah.store.service;

import com.samah.store.dto.admin.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminCatalogService {

    // ==================== CATEGORIES ====================
    AdminCategoryResponse createCategory(AdminCategoryRequest request);
    AdminCategoryResponse updateCategory(Long id, AdminCategoryRequest request);
    void deleteCategory(Long id); // Soft delete
    void deleteCategoryPermanently(Long id); // Hard delete
    AdminCategoryResponse toggleCategoryStatus(Long id, Boolean active);
    Page<AdminCategoryResponse> listCategories(Pageable pageable);
    AdminCategoryResponse getCategoryById(Long id);

    // ==================== PRODUCTS ====================
    AdminProductResponse createProduct(AdminProductRequest request);
    AdminProductResponse updateProduct(Long id, AdminProductRequest request);
    void deleteProduct(Long id); // Soft delete
    void deleteProductPermanently(Long id); // Hard delete
    AdminProductResponse toggleProductStatus(Long id, Boolean active);
    Page<AdminProductListItem> listProducts(Long categoryId, String query, Boolean active, Pageable pageable);
    AdminProductResponse getProductById(Long id);

    // ==================== VARIANTS ====================
    AdminVariantResponse createVariant(Long productId, AdminVariantRequest request);
    AdminVariantResponse updateVariant(Long variantId, AdminVariantRequest request);
    void deleteVariant(Long variantId);
    AdminVariantResponse updateStock(Long variantId, Integer stockQuantity);
    List<AdminVariantResponse> listVariantsByProduct(Long productId);

    // ==================== IMAGES ====================
    AdminImageResponse addImage(Long productId, AdminImageRequest request);
    void removeImage(Long productId, Long imageId);
    List<AdminImageResponse> listImagesByProduct(Long productId);
}

