ALTER TABLE orders ADD COLUMN assigned_employee_id BIGINT;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_employee
FOREIGN KEY (assigned_employee_id) REFERENCES users(id);

CREATE INDEX idx_orders_assigned_employee ON orders(assigned_employee_id);

