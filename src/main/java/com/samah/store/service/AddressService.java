package com.samah.store.service;

import com.samah.store.dto.AddressDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AddressService {

    @Transactional
    AddressDto create(Long customerId, AddressDto dto);

    @Transactional
    AddressDto update(Long customerId, Long id, AddressDto dto);

    @Transactional
    void delete(Long customerId, Long id);

    @Transactional(readOnly = true)
    AddressDto get(Long customerId, Long id);

    @Transactional(readOnly = true)
    List<AddressDto> list(Long customerId);
}

