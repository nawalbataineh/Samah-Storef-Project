package com.samah.store.service;

import com.samah.store.dto.CategoryDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CategoryService {

    @Transactional
    CategoryDto create(String name, String slug, boolean active);

    @Transactional
    CategoryDto update(Long id, String name, String slug, boolean active);

    @Transactional
    void delete(Long id);

    @Transactional(readOnly = true)
    CategoryDto get(Long id);

    @Transactional(readOnly = true)
    List<CategoryDto> listAll();

    @Transactional(readOnly = true)
    List<CategoryDto> listPublic();
}

