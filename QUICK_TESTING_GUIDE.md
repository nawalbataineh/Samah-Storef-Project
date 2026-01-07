# 🧪 QUICK TESTING GUIDE - THREE FIXES

## Prerequisites
- Backend running with new migration applied
- Frontend running with new build
- Admin and Customer accounts ready
- At least one product with sufficient stock

---

## ⚡ QUICK TEST (10 minutes)

### Test 1: New Order Flow (3 min) ✅

```
Customer Side:
1. Add product to cart (qty: 2)
2. Checkout → Place order
   ✅ Order created successfully

Admin Side:
3. Login as ADMIN
4. Go to Orders (Active tab)
   ✅ New order visible
   ✅ Status badge shows "جديد" (NEW)
   ✅ "جديد" filter button shows count

Status: PASS ✅ / FAIL ❌
```

---

### Test 2: Stock Deduction at SHIPPED (4 min) ✅

```
Setup:
- Product variant: Stock = 10
- Order quantity: 2

Steps:
1. Admin Orders → Find NEW order
2. Note product stock: _____
3. Change status: NEW → PROCESSING
   ✅ Success, stock still 10
4. Change status: PROCESSING → SHIPPED
   ✅ Success
   ✅ Stock now = 8 (10 - 2)
   ✅ Toast: "تم تحديث حالة الطلب بنجاح"

Verify in DB (optional):
SELECT stock_deducted FROM store.orders WHERE id = <order_id>;
-- Should be: TRUE

Status: PASS ✅ / FAIL ❌
```

---

### Test 3: SHIPPED → DELIVERED (No Error) (1 min) ✅

```
Continuing from Test 2:

Steps:
1. Change status: SHIPPED → DELIVERED
   ✅ Success (NO stock error!)
   ✅ Order moves to Delivered tab
   ✅ Stock still 8 (not decremented again)

Status: PASS ✅ / FAIL ❌
```

---

### Test 4: Revenue Reset (2 min) ✅

```
Steps:
1. Admin Dashboard → Note revenue: _____ JOD
2. Click red "تصفير إجمالي الإيرادات" button
3. Confirm in modal
   ✅ Revenue shows 0.00 JOD immediately
   ✅ Toast success
4. Refresh page (F5)
   ✅ Revenue still 0.00 JOD
   ✅ Date updated to today

Status: PASS ✅ / FAIL ❌
```

---

## 🔴 FAILURE SCENARIOS (Test These Too)

### Test 5: Insufficient Stock at SHIPPED ❌

```
Setup:
- Product variant: Stock = 1
- Order quantity: 5

Steps:
1. Try to change order to SHIPPED
   ✅ ERROR displayed
   ✅ Toast: "لا يمكن شحن الطلب - المخزون غير كافٍ"
   ✅ Status NOT changed
   ✅ Stock NOT decremented

Status: PASS ✅ / FAIL ❌
```

---

### Test 6: Idempotency Check ✅

```
Steps:
1. Order at SHIPPED (stock already deducted)
2. Change to PROCESSING
3. Change back to SHIPPED
   ✅ Success
   ✅ Stock NOT deducted again
   ✅ Stock remains correct

Status: PASS ✅ / FAIL ❌
```

---

## 📊 FINAL VERIFICATION

### All Tests Summary

| Test | Expected | Status |
|------|----------|--------|
| 1. New Order = NEW | ✅ | ⬜ |
| 2. Stock @ SHIPPED | ✅ | ⬜ |
| 3. SHIPPED→DELIVERED OK | ✅ | ⬜ |
| 4. Revenue Reset | ✅ | ⬜ |
| 5. Low Stock Error | ✅ | ⬜ |
| 6. Idempotency | ✅ | ⬜ |

**Overall**: PASS ✅ / FAIL ❌

---

## 🐛 TROUBLESHOOTING

### Issue: Stock not decremented at SHIPPED

**Check:**
1. Backend logs for errors
2. Database: `SELECT stock_deducted FROM store.orders WHERE id = ?`
3. Variant stock value before/after

---

### Issue: Revenue reset doesn't persist

**Check:**
1. Network tab: Verify POST /api/admin/metrics/revenue-reset returns 200
2. Check response from GET /api/admin/metrics
3. Backend logs for errors
4. Database: Check if AdminSettings table has revenueResetAt updated

---

### Issue: NEW orders not visible

**Check:**
1. Frontend network tab: GET /api/admin/orders?delivered=false
2. Response should include status: "NEW"
3. Backend listing logic includes NEW in active filter

---

## ✅ ACCEPTANCE CRITERIA

**All fixes successful if:**

✅ New orders created with status = NEW
✅ Stock deducted ONLY at SHIPPED transition
✅ SHIPPED → DELIVERED works without stock error
✅ Stock deducted exactly once (idempotent)
✅ Insufficient stock blocks SHIPPED transition
✅ Revenue reset sets to 0.00 and persists
✅ UI updates immediately (optimistic)
✅ All builds compile
✅ No console errors

---

**Testing Time**: ~10 minutes  
**Complexity**: Low-Medium  
**Priority**: Critical  
**Status**: Ready ✅

