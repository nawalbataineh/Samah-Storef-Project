package com.samah.store.service;

import com.samah.store.dto.EmployeeTaskRequestDto;
import com.samah.store.dto.EmployeeTaskResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface EmployeeTaskService {
    @Transactional(readOnly = true)
    Page<EmployeeTaskResponseDto> getMyTasks(Long employeeId, Pageable pageable);

    @Transactional(readOnly = true)
    EmployeeTaskResponseDto getTaskById(Long taskId, Long employeeId, boolean isAdmin);

    @Transactional
    EmployeeTaskResponseDto createTask(EmployeeTaskRequestDto dto, Long employeeId);

    @Transactional
    EmployeeTaskResponseDto updateTask(Long taskId, EmployeeTaskRequestDto dto, Long employeeId, boolean isAdmin);

    @Transactional
    void deleteTask(Long taskId, Long employeeId, boolean isAdmin);
}

