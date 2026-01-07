package com.samah.store.repository;

import com.samah.store.domain.entites.EmployeeTask;
import com.samah.store.domain.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeTaskRepository extends JpaRepository<EmployeeTask, Long> {
    Page<EmployeeTask> findByAssignedEmployeeId(Long employeeId, Pageable pageable);

    Page<EmployeeTask> findByAssignedEmployeeIdAndStatus(Long employeeId, TaskStatus status, Pageable pageable);

    long countByAssignedEmployeeIdAndStatus(Long employeeId, TaskStatus status);
}

