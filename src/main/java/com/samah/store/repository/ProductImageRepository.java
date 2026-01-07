package com.samah.store.repository;

import com.samah.store.domain.entites.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);
    Optional<ProductImage> findFirstByProductIdOrderBySortOrderAsc(Long productId);
    List<ProductImage> findByProductIdIn(List<Long> productIds);
}
