package com.samah.store.service.impl;

import com.samah.store.domain.entites.Address;
import com.samah.store.domain.entites.User;
import com.samah.store.dto.AddressDto;
import com.samah.store.exception.ForbiddenException;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressServiceImpl implements com.samah.store.service.AddressService {

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional
    public AddressDto create(Long customerId, AddressDto dto) {
        Address address = new Address();
        User userRef = new User();
        userRef.setId(customerId);
        address.setCustomer(userRef);
        address.setCity(dto.city());
        address.setStreet(dto.street());
        address.setDetails(dto.details());
        address.setPhone(dto.phone());
        Address saved = addressRepository.save(address);
        return toDto(saved);
    }

    @Override
    @Transactional
    public AddressDto update(Long customerId, Long id, AddressDto dto) {
        Address address = addressRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
        enforceOwnership(address, customerId);
        address.setCity(dto.city());
        address.setStreet(dto.street());
        address.setDetails(dto.details());
        address.setPhone(dto.phone());
        return toDto(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void delete(Long customerId, Long id) {
        Address address = addressRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
        enforceOwnership(address, customerId);
        addressRepository.delete(address);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressDto get(Long customerId, Long id) {
        Address address = addressRepository.findByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
        enforceOwnership(address, customerId);
        return toDto(address);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> list(Long customerId) {
        return addressRepository.findByCustomerId(customerId).stream()
                .map(this::toDto)
                .toList();
    }

    private void enforceOwnership(Address address, Long customerId) {
        if (address.getCustomer() == null || address.getCustomer().getId() == null || !address.getCustomer().getId().equals(customerId)) {
            throw new ForbiddenException("Address does not belong to user");
        }
    }

    private AddressDto toDto(Address address) {
        return new AddressDto(address.getId(), address.getCity(), address.getStreet(), address.getDetails(), address.getPhone());
    }
}

