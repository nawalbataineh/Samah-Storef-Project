-- URGENT FIX: Run this SQL script manually in PostgreSQL to fix the "value too long" error
-- This alters the orders table columns to accommodate larger values

-- Connect to your database first:
-- psql -U postgres -d samah_store

-- Then run:

ALTER TABLE store.orders ALTER COLUMN payment_method TYPE varchar(30);
ALTER TABLE store.orders ALTER COLUMN tracking_code TYPE varchar(64);

-- Verify the changes:
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'store'
  AND table_name = 'orders'
  AND column_name IN ('payment_method', 'tracking_code');

-- Expected output:
--  column_name    | data_type         | character_maximum_length
-- ----------------+-------------------+--------------------------
--  payment_method | character varying | 30
--  tracking_code  | character varying | 64

