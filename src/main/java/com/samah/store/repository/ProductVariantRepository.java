package com.samah.store.repository;

import com.samah.store.domain.entites.ProductVariant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByProductIdAndActiveIsTrueAndDeletedIsFalse(Long productId);
    List<ProductVariant> findByProductIdAndStockQuantityGreaterThan(Long productId, Integer stockQuantity);
    Optional<ProductVariant> findBySku(String sku);
    boolean existsByProductIdAndSizeAndColor(Long productId, String size, String color);

    @EntityGraph(attributePaths = {"product"})
    Optional<ProductVariant> findByIdAndActiveIsTrueAndDeletedIsFalse(Long id);

    @Query("select distinct v.product.id from ProductVariant v where (:min is null or v.price >= :min) and (:max is null or v.price <= :max)")
    List<Long> findDistinctProductIdsByPriceRange(@Param("min") BigDecimal min, @Param("max") BigDecimal max);

    List<ProductVariant> findByProductIdIn(List<Long> productIds);

    @Modifying
    @Query("update ProductVariant v set v.stockQuantity = v.stockQuantity - :qty where v.id = :id and v.stockQuantity >= :qty")
    int decrementStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);
}
