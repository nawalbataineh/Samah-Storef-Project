package com.samah.store.service.impl;

import com.samah.store.domain.entites.EmployeeTask;
import com.samah.store.domain.entites.Order;
import com.samah.store.domain.entites.User;
import com.samah.store.dto.EmployeeTaskRequestDto;
import com.samah.store.dto.EmployeeTaskResponseDto;
import com.samah.store.repository.EmployeeTaskRepository;
import com.samah.store.repository.OrderRepository;
import com.samah.store.repository.UserRepository;
import com.samah.store.service.EmployeeTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EmployeeTaskServiceImpl implements EmployeeTaskService {

    private final EmployeeTaskRepository taskRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    public Page<EmployeeTaskResponseDto> getMyTasks(Long employeeId, Pageable pageable) {
        return taskRepository.findByAssignedEmployeeId(employeeId, pageable)
                .map(this::toDto);
    }

    @Override
    public EmployeeTaskResponseDto getTaskById(Long taskId, Long employeeId, boolean isAdmin) {
        EmployeeTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "المهمة غير موجودة"));

        if (!isAdmin && !task.getAssignedEmployee().getId().equals(employeeId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "غير مصرح لك بالوصول لهذه المهمة");
        }

        return toDto(task);
    }

    @Override
    public EmployeeTaskResponseDto createTask(EmployeeTaskRequestDto dto, Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "الموظف غير موجود"));

        EmployeeTask task = new EmployeeTask();
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());
        task.setDueAt(dto.dueAt());
        task.setAssignedEmployee(employee);

        if (dto.relatedOrderId() != null) {
            Order order = orderRepository.findById(dto.relatedOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "الطلب غير موجود"));
            task.setRelatedOrder(order);
        }

        task = taskRepository.save(task);
        return toDto(task);
    }

    @Override
    public EmployeeTaskResponseDto updateTask(Long taskId, EmployeeTaskRequestDto dto, Long employeeId, boolean isAdmin) {
        EmployeeTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "المهمة غير موجودة"));

        if (!isAdmin && !task.getAssignedEmployee().getId().equals(employeeId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "غير مصرح لك بتعديل هذه المهمة");
        }

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());
        task.setDueAt(dto.dueAt());

        if (dto.relatedOrderId() != null) {
            Order order = orderRepository.findById(dto.relatedOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "الطلب غير موجود"));
            task.setRelatedOrder(order);
        } else {
            task.setRelatedOrder(null);
        }

        task = taskRepository.save(task);
        return toDto(task);
    }

    @Override
    public void deleteTask(Long taskId, Long employeeId, boolean isAdmin) {
        EmployeeTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "المهمة غير موجودة"));

        if (!isAdmin && !task.getAssignedEmployee().getId().equals(employeeId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "غير مصرح لك بحذف هذه المهمة");
        }

        taskRepository.delete(task);
    }

    private EmployeeTaskResponseDto toDto(EmployeeTask task) {
        return new EmployeeTaskResponseDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueAt(),
                task.getRelatedOrder() != null ? task.getRelatedOrder().getId() : null,
                task.getAssignedEmployee().getId(),
                task.getAssignedEmployee().getUsername(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}

