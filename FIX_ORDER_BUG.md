# URGENT FIX - Order Creation Error

## Problem
Checkout was failing with PostgreSQL error:
```
ERROR: value too long for type character varying(10)
```

## Root Cause
The `payment_method` column in `store.orders` table was defined as `varchar(10)`, but the enum value `CASH_ON_DELIVERY` has 16 characters.

## Solution Applied

### 1. Entity Fix (DONE)
Updated `Order.java`:
- `paymentMethod`: `@Column(length = 10)` → `@Column(length = 30)`
- `trackingCode`: `@Column(length = 60)` → `@Column(length = 64)`

### 2. Database Migration Required

**OPTION A: Manual SQL (Immediate Fix)**
```bash
# Connect to PostgreSQL
psql -U postgres -d samah_store

# Run the fix
\i fix_orders_table.sql
```

OR run directly:
```sql
ALTER TABLE store.orders ALTER COLUMN payment_method TYPE varchar(30);
ALTER TABLE store.orders ALTER COLUMN tracking_code TYPE varchar(64);
```

**OPTION B: Enable Flyway and Restart**
1. Edit `src/main/resources/application.yaml`:
   ```yaml
   flyway:
     enabled: true  # Change from false to true
   ```
2. Restart backend - Flyway will auto-apply `V7__fix_order_column_lengths.sql`

**OPTION C: Use Hibernate DDL Update (Temporary)**
Hibernate `ddl-auto: update` should automatically adjust column lengths on next restart, but it's not reliable for production.

### 3. Error Handling (DONE)
Added `DataIntegrityViolationException` handler in `GlobalExceptionHandler.java`:
- Returns 400 with Arabic message: "القيمة المدخلة طويلة جداً - يرجى تقصيرها"
- Logs full error details

## Testing After Fix

1. **Apply database migration** (choose one option above)

2. **Restart backend**

3. **Test order creation**:
```bash
# Login as CUSTOMER
POST http://localhost:8080/api/auth/login
Body: { "usernameOrEmail": "customer@test.com", "password": "password" }

# Add item to cart
POST http://localhost:8080/api/cart/items
Body: { "variantId": 1, "quantity": 1 }

# Create address
POST http://localhost:8080/api/addresses
Body: { "city": "عمّان", "street": "شارع الجامعة", "details": "بناية 5", "phone": "0791234567" }

# Place order (CRITICAL TEST)
POST http://localhost:8080/api/orders
Body: { "addressId": 1, "couponCode": null }

# Expected: 200/201 with order data
# Expected DB: Order created with payment_method = 'CASH_ON_DELIVERY'
```

4. **Verify in database**:
```sql
SELECT id, payment_method, tracking_code, status, total 
FROM store.orders 
ORDER BY created_at DESC 
LIMIT 5;
```

## Files Changed
- `Order.java` - Fixed column lengths
- `GlobalExceptionHandler.java` - Added DataIntegrityViolationException handler
- `V7__fix_order_column_lengths.sql` - Flyway migration (new)
- `fix_orders_table.sql` - Manual migration script (new)
- `FIX_ORDER_BUG.md` - This file (new)

## Prevention
All future enum values in Order entity should be reviewed to ensure column lengths are adequate:
- `OrderStatus` (length=25): OK for current values
- `PaymentMethod` (length=30): OK for `CASH_ON_DELIVERY` + future payment methods

---
**Status:** ✅ Code Fixed | ⏳ Database Migration Required | 🔄 Testing Needed

