package com.samah.store.controller;

import com.samah.store.dto.EmployeeTaskRequestDto;
import com.samah.store.dto.EmployeeTaskResponseDto;
import com.samah.store.service.EmployeeTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee/tasks")
@PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
@RequiredArgsConstructor
public class EmployeeTaskController {

    private final EmployeeTaskService taskService;
    private final com.samah.store.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<EmployeeTaskResponseDto>> getMyTasks(
            Pageable pageable,
            Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        return ResponseEntity.ok(taskService.getMyTasks(employeeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeTaskResponseDto> getTaskById(
            @PathVariable Long id,
            Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        boolean isAdmin = isAdmin(authentication);
        return ResponseEntity.ok(taskService.getTaskById(id, employeeId, isAdmin));
    }

    @PostMapping
    public ResponseEntity<EmployeeTaskResponseDto> createTask(
            @Valid @RequestBody EmployeeTaskRequestDto request,
            Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        return ResponseEntity.ok(taskService.createTask(request, employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeTaskResponseDto> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeTaskRequestDto request,
            Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        boolean isAdmin = isAdmin(authentication);
        return ResponseEntity.ok(taskService.updateTask(id, request, employeeId, isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {
        Long employeeId = getCurrentEmployeeId(authentication);
        boolean isAdmin = isAdmin(authentication);
        taskService.deleteTask(id, employeeId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentEmployeeId(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow()
                .getId();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
    }
}

