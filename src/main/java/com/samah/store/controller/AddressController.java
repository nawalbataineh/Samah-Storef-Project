package com.samah.store.controller;

import com.samah.store.dto.AddressDto;
import com.samah.store.dto.AddressRequest;
import com.samah.store.exception.NotFoundException;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.AddressService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@PreAuthorize("hasRole('CUSTOMER')")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<AddressDto> list(Authentication auth) {
        Long userId = resolveUserId(auth.getName());
        return addressService.list(userId);
    }

    @PostMapping
    public AddressDto create(Authentication auth, @RequestBody AddressRequest request) {
        Long userId = resolveUserId(auth.getName());
        return addressService.create(userId, new AddressDto(null, request.city(), request.street(), request.details(), request.phone()));
    }

    @PutMapping("/{id}")
    public AddressDto update(Authentication auth, @PathVariable Long id, @RequestBody AddressRequest request) {
        Long userId = resolveUserId(auth.getName());
        return addressService.update(userId, id, new AddressDto(id, request.city(), request.street(), request.details(), request.phone()));
    }

    @DeleteMapping("/{id}")
    public void delete(Authentication auth, @PathVariable Long id) {
        Long userId = resolveUserId(auth.getName());
        addressService.delete(userId, id);
    }

    private Long resolveUserId(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
