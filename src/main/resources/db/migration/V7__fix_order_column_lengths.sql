-- Fix Order table column lengths to prevent "value too long" errors
-- V7__fix_order_column_lengths.sql

-- Increase payment_method from varchar(10) to varchar(30) to accommodate 'CASH_ON_DELIVERY'
ALTER TABLE store.orders ALTER COLUMN payment_method TYPE varchar(30);

-- Increase tracking_code from varchar(60) to varchar(64) for future compatibility
ALTER TABLE store.orders ALTER COLUMN tracking_code TYPE varchar(64);

