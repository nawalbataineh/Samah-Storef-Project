package com.samah.store.service;

import com.samah.store.dto.ProductDto;
import com.samah.store.dto.ProductSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface ProductService {

    @Transactional(readOnly = true)
    Page<ProductSummaryDto> search(String q, Long categoryId, Double minPrice, Double maxPrice, Pageable pageable);

    @Transactional(readOnly = true)
    ProductDto getBySlug(String slug);

    @Transactional
    ProductDto create(ProductDto productDto);

    @Transactional
    ProductDto update(Long id, ProductDto productDto);

    @Transactional
    void delete(Long id);
}
