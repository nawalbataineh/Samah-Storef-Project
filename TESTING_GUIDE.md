# QUICK TESTING GUIDE - ADMIN FIXES

## Postman / cURL Testing

### 1. Test Category Status Toggle
```bash
# Toggle category to inactive
curl -X PATCH "http://localhost:8080/api/admin/categories/1/status?active=false" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Toggle back to active
curl -X PATCH "http://localhost:8080/api/admin/categories/1/status?active=true" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Test Permanent Delete Category
```bash
# Should succeed if no products
curl -X DELETE "http://localhost:8080/api/admin/categories/5/permanent" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Should fail with 409 if products exist
curl -X DELETE "http://localhost:8080/api/admin/categories/1/permanent" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Test Product Status Toggle
```bash
curl -X PATCH "http://localhost:8080/api/admin/products/1/status?active=false" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Test Delivered Orders Filter
```bash
# Get active orders only
curl "http://localhost:8080/api/admin/orders?delivered=false&page=0&size=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get delivered orders only
curl "http://localhost:8080/api/admin/orders?delivered=true&page=0&size=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get all orders (no filter)
curl "http://localhost:8080/api/admin/orders?page=0&size=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Test Stock Decrement on Delivery
```bash
# Before: Check variant stock
curl "http://localhost:8080/api/admin/variants/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Mark order as DELIVERED (will decrement stock)
curl -X PATCH "http://localhost:8080/api/admin/orders/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DELIVERED"}'

# After: Check variant stock again (should be reduced)
curl "http://localhost:8080/api/admin/variants/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Try marking as DELIVERED again (should NOT decrement again - idempotent)
curl -X PATCH "http://localhost:8080/api/admin/orders/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DELIVERED"}'
```

### 6. Test Coupon Case Insensitivity
```bash
# Apply with lowercase
curl -X POST "http://localhost:8080/api/coupons/apply" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"summer2024","subtotal":100}'

# Apply with uppercase (should work the same)
curl -X POST "http://localhost:8080/api/coupons/apply" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"SUMMER2024","subtotal":100}'

# Apply with mixed case (should work)
curl -X POST "http://localhost:8080/api/coupons/apply" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"SuMmEr2024","subtotal":100}'
```

---

## Database Verification

### Check Stock Before/After Delivery
```sql
-- Before delivery
SELECT id, sku, stock_quantity FROM store.product_variants WHERE id = 1;

-- (Mark order as delivered via API)

-- After delivery (stock should be reduced by order quantity)
SELECT id, sku, stock_quantity FROM store.product_variants WHERE id = 1;
```

### Check Order Status Changes
```sql
-- View order status history
SELECT id, status, created_at, updated_at 
FROM store.orders 
WHERE id = 1;
```

### Verify Permanent Deletion
```sql
-- Before permanent delete
SELECT COUNT(*) FROM store.categories WHERE id = 5;

-- (Delete permanently via API)

-- After permanent delete (should return 0)
SELECT COUNT(*) FROM store.categories WHERE id = 5;
```

---

## Expected Results

### ✅ Category Status Toggle:
- Response: Updated category with new `active` value
- Status: 200 OK

### ✅ Permanent Delete (no products):
- Response: 204 No Content
- Database: Row actually deleted

### ❌ Permanent Delete (with products):
- Response: 409 Conflict
- Message: "Cannot permanently delete category with X products..."

### ✅ Stock Decrement:
- First DELIVERED: Stock reduces by order quantity
- Second DELIVERED: Stock stays same (idempotent)
- Insufficient stock: 400 Bad Request

### ✅ Delivered Filter:
- `?delivered=false`: Only non-delivered orders
- `?delivered=true`: Only delivered orders
- No param: All orders

### ✅ Coupon Case:
- All case variations return same discount
- Code normalized to UPPERCASE internally

---

## Common Issues & Solutions

### Issue: Stock goes negative
**Cause**: Order created without proper stock validation
**Fix**: Ensure order placement validates stock first

### Issue: Stock decrements twice
**Cause**: Idempotency check missing
**Fix**: Already fixed - check `oldStatus != DELIVERED`

### Issue: Cannot delete category
**Cause**: Products still assigned to it
**Fix**: Reassign or delete products first, or use soft delete

### Issue: Coupon not applying
**Cause**: Case mismatch
**Fix**: Already fixed - code normalized to uppercase

---

## Quick Smoke Test (5 minutes)

1. **Login as ADMIN**
2. **Create category** → Toggle inactive → Toggle active → Works ✓
3. **Create product** → Add variant with stock=10
4. **Place order** as CUSTOMER with 2 items
5. **Mark order PROCESSING** → Stock stays 10 ✓
6. **Mark order SHIPPED** → Stock stays 10 ✓
7. **Mark order DELIVERED** → Stock becomes 8 ✓
8. **Mark order DELIVERED again** → Stock stays 8 (idempotent) ✓
9. **Apply coupon "TEST"** → Works ✓
10. **Apply coupon "test"** → Works (case insensitive) ✓

---

**All tests passing = Ready for production ✅**

