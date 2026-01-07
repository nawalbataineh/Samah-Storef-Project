package com.samah.store.domain.entites;

import com.samah.store.domain.enums.TaskPriority;
import com.samah.store.domain.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "employee_tasks")
@Getter
@Setter
public class EmployeeTask extends BaseEntity {
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(name = "due_at")
    private Instant dueAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_employee_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_tasks_employee"))
    private User assignedEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_order_id",
            foreignKey = @ForeignKey(name = "fk_tasks_order"))
    private Order relatedOrder;
}

