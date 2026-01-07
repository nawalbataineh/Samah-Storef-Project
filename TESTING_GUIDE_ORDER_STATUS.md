# QUICK TESTING GUIDE - Order Status Updates

## Prerequisites
1. Backend running on `http://localhost:8080`
2. Frontend running on `http://localhost:5173` (or the port Vite shows)
3. At least one ADMIN user account

---

## TEST SCENARIO 1: Basic Flow (NEW → PROCESSING → SHIPPED → DELIVERED)

### Steps:
1. Login as ADMIN
2. Navigate to **Admin → Orders** (الطلبات)
3. Find an order with status **NEW** (جديد)
4. Click the status dropdown on that order
5. Select **PROCESSING** (قيد المعالجة)
6. Confirm - should see green toast: "تم تحديث حالة الطلب بنجاح"
7. Select **SHIPPED** (تم الشحن)
8. Confirm - should succeed
9. Select **DELIVERED** (تم التوصيل)
10. Confirm - order should **disappear from Active tab**
11. Click **Delivered tab** (الطلبات المُسلّمة)
12. Verify order appears there

**Expected**: All transitions succeed, no errors ✅

---

## TEST SCENARIO 2: Express Order (NEW → SHIPPED directly)

### Steps:
1. Find an order with status **NEW**
2. Click status dropdown
3. Select **SHIPPED** (skip PROCESSING)
4. Confirm - should succeed

**Expected**: Transition allowed (flexible workflow) ✅

---

## TEST SCENARIO 3: Failed Pickup (SHIPPED → FAILED_PICKUP)

### Steps:
1. Find an order with status **SHIPPED**
2. Click status dropdown
3. Select **FAILED_PICKUP** (تعذر الاستلام)
4. Confirm - order should **disappear from list**

**Expected**: Order removed from both Active and Delivered tabs ✅

---

## TEST SCENARIO 4: Idempotent Update (Same Status Twice)

### Steps:
1. Find an order with status **PROCESSING**
2. Select **PROCESSING** again from dropdown
3. Confirm

**Expected**: No error, status stays the same, toast shows success ✅

---

## TEST SCENARIO 5: Invalid Transition (Terminal State)

### Steps:
1. Go to **Delivered tab**
2. Find an order with status **DELIVERED**
3. Try to change status to anything else

**Expected**: Error toast with Arabic message: "لا يمكن تغيير حالة الطلب بعد التوصيل أو تعذر الاستلام" ❌

---

## TEST SCENARIO 6: Revenue Tracking

### Steps:
1. Go to **Admin Dashboard**
2. Note current revenue value
3. Go back to Orders
4. Mark an order as **DELIVERED**
5. Return to Dashboard
6. Click refresh or reload page

**Expected**: Revenue increases by that order's total ✅

---

## DEBUGGING TIPS

### If Status Update Fails:

**Check Browser Console** (F12):
```javascript
// Look for error messages
// Check Network tab for the PATCH request to /api/admin/orders/{id}/status
```

**Check Request Payload**:
```json
// Should be:
{
  "status": "PROCESSING"  // ← enum value (English), NOT Arabic
}
```

**Check Response**:
```json
// Success (200):
{
  "id": 123,
  "status": "PROCESSING",
  ...
}

// Error (400):
{
  "message": "لا يمكن التحويل من DELIVERED إلى PROCESSING"
}
```

**Backend Logs**:
```
# Look for lines containing:
OrderServiceImpl : updateStatus
BadRequestException
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "خطأ في البيانات" toast | Frontend sent Arabic label instead of enum | Already fixed - frontend sends enum |
| "Cannot transition from X to Y" | Invalid transition attempt | Check allowed transitions in this guide |
| Order doesn't disappear after DELIVERED | Frontend filter not working | Fixed - optimistic update implemented |
| Stock error on status update | Stock being deducted twice | Fixed - stock deducted only at checkout |
| 403 Forbidden | Missing admin role | Ensure logged in as ADMIN |

---

## Success Criteria (ALL MUST PASS)

- [ ] NEW → PROCESSING works
- [ ] PROCESSING → SHIPPED works
- [ ] SHIPPED → DELIVERED works (moves to Delivered tab)
- [ ] SHIPPED → FAILED_PICKUP works (disappears)
- [ ] NEW → SHIPPED works (express order)
- [ ] PROCESSING → DELIVERED works (skip shipped step)
- [ ] Same status twice works (idempotent)
- [ ] Cannot change from DELIVERED (terminal state protected)
- [ ] All error messages are in Arabic
- [ ] No "insufficient stock" errors on status updates

---

## Expected Network Requests

### Status Update
```http
PATCH /api/admin/orders/123/status HTTP/1.1
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "status": "PROCESSING",
  "customer": { "id": 5, "username": "customer1", "email": "..." },
  "address": { ... },
  "items": [ ... ],
  "total": 120.50,
  ...
}
```

---

## If Everything Works:
🎉 **System is production-ready!** All order status transitions are working correctly.

## If Issues Persist:
1. Check backend logs for exceptions
2. Verify token is valid (not expired)
3. Ensure user has ADMIN role
4. Check database: order actually exists and is in expected state
5. Try restarting both backend and frontend

