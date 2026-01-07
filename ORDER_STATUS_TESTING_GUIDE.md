# 🧪 ORDER STATUS RESTRICTIONS - TESTING GUIDE

## Prerequisites
- Backend running: `http://localhost:8080`
- Frontend running: `http://localhost:5173` (or current port)
- At least 2-3 test orders in the system
- Admin account credentials

---

## 🎯 QUICK TEST SCENARIOS (15 minutes)

### Test #1: Status Dropdown Shows Only 4 Options ✅

**Steps:**
1. Login as ADMIN
2. Navigate to `/admin/orders`
3. Click on any order row to expand details
4. Look at the status dropdown

**✅ Expected Result:**
- Dropdown contains EXACTLY 4 options:
  1. قيد المعالجة (PROCESSING)
  2. تم الشحن (SHIPPED)
  3. تم التوصيل (DELIVERED)
  4. تعذر الاستلام (FAILED_PICKUP)
- No other statuses visible (NEW, PENDING, CONFIRMED, CANCELLED removed)

**❌ Fail if:**
- More than 4 options appear
- Old statuses still visible

---

### Test #2: PROCESSING → SHIPPED (Stays in Active Tab) ✅

**Steps:**
1. On Admin Orders page (Active tab)
2. Find an order with status PROCESSING
3. Change status to SHIPPED
4. Confirm the change

**✅ Expected Result:**
- Toast message: "تم تحديث حالة الطلب بنجاح"
- Order REMAINS in the Active tab list
- Status badge updates to "تم الشحن"
- Order count stays the same
- No page reload

**❌ Fail if:**
- Order disappears from Active tab
- Error message appears
- Page reloads

---

### Test #3: PROCESSING → DELIVERED (Moves to Delivered Tab) ✅

**Steps:**
1. On Admin Orders page (Active tab)
2. Find an order with status PROCESSING
3. Change status to DELIVERED
4. Confirm the change
5. Switch to "Delivered" tab

**✅ Expected Result:**
- Toast message: "تم تحديث حالة الطلب بنجاح"
- Order DISAPPEARS from Active tab immediately (optimistic update)
- Active tab order count decreases by 1
- Switch to Delivered tab → order appears there
- Delivered tab count increases by 1

**❌ Fail if:**
- Order still visible in Active tab after update
- Order not found in Delivered tab
- Counts don't update

---

### Test #4: PROCESSING → FAILED_PICKUP (Disappears Forever) ✅

**Steps:**
1. On Admin Orders page (Active tab)
2. Find an order with status PROCESSING
3. Change status to FAILED_PICKUP
4. Confirm the change
5. Check Active tab
6. Switch to Delivered tab
7. Press F5 to refresh page
8. Check both tabs again

**✅ Expected Result:**
- Toast message: "تم تحديث حالة الطلب بنجاح"
- Order DISAPPEARS from Active tab immediately
- Active tab count decreases by 1
- Order NOT in Delivered tab
- After refresh (F5): order still NOT visible in either tab
- Order still exists in database (not deleted - just hidden from UI)

**❌ Fail if:**
- Order visible in Active or Delivered tab
- Order appears after refresh
- Error occurs

---

### Test #5: Active Tab Shows Only PROCESSING & SHIPPED ✅

**Steps:**
1. Navigate to Admin Orders page
2. Ensure you're on "Active" tab (delivered=false)
3. Observe the orders shown

**✅ Expected Result:**
- ONLY orders with status PROCESSING or SHIPPED are visible
- No DELIVERED orders shown
- No FAILED_PICKUP orders shown
- No NEW/PENDING/CONFIRMED orders shown
- Filter buttons show correct counts

**❌ Fail if:**
- DELIVERED orders appear in Active tab
- FAILED_PICKUP orders appear
- Old status orders (NEW/PENDING) appear

---

### Test #6: Delivered Tab Shows Only DELIVERED ✅

**Steps:**
1. Navigate to Admin Orders page
2. Click "Delivered" tab
3. Observe the orders shown

**✅ Expected Result:**
- ONLY orders with status DELIVERED are visible
- No PROCESSING orders shown
- No SHIPPED orders shown
- No FAILED_PICKUP orders shown
- Count matches number of delivered orders

**❌ Fail if:**
- Non-delivered orders appear
- FAILED_PICKUP orders appear
- Count is incorrect

---

### Test #7: Backend Validation Prevents Invalid Status ✅

**Steps (Manual API Test):**
```bash
# Try to set invalid status via API
curl -X PATCH http://localhost:8080/api/admin/orders/1/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CANCELLED"}'
```

**✅ Expected Result:**
- Returns HTTP 400 Bad Request
- Error message: "يمكن تحديث الحالة إلى: قيد المعالجة، تم الشحن، تم التوصيل، أو تعذر الاستلام فقط"
- Order status NOT changed in database

**Alternative UI Test:**
1. Open browser DevTools
2. In console, try to call API with invalid status
3. Verify 400 response

**❌ Fail if:**
- Invalid status accepted
- No error message
- Status changed to invalid value

---

### Test #8: Persistence After Refresh ✅

**Steps:**
1. Perform Test #4 (change to FAILED_PICKUP)
2. Note the order ID
3. Close browser completely
4. Reopen browser
5. Login as ADMIN again
6. Navigate to Admin Orders
7. Search for the order ID in both tabs

**✅ Expected Result:**
- Order NOT visible in Active tab
- Order NOT visible in Delivered tab
- Order still exists in database (can check via SQL)
- Behavior persists across sessions

**❌ Fail if:**
- Order reappears after browser restart
- Order visible in any tab

---

## 📊 FILTER & STATS VERIFICATION

### Stats Cards Calculation ✅

**Check:**
1. Active tab → Note the stats cards:
   - "إجمالي" (Total)
   - "غير معيّنة" (Unassigned)
   - "قيد المعالجة" (Processing)
   - "تم الشحن" (Shipped)

2. Verify counts:
   - Total = number of visible orders
   - Unassigned = orders without assignedEmployee (and status in PROCESSING/SHIPPED)
   - Processing = orders with status PROCESSING
   - Shipped = orders with status SHIPPED

**✅ Expected:**
- All counts match actual visible orders
- No "معلقة" (Pending) card (removed)
- Clicking stat cards filters correctly

---

## 🔍 EDGE CASES TO TEST

### Edge Case 1: Empty Active Tab ✅

**Setup:** Change all orders to DELIVERED or FAILED_PICKUP

**Expected:**
- Active tab shows empty state
- Counts show 0
- No errors
- UI displays gracefully

---

### Edge Case 2: Concurrent Updates ✅

**Setup:** Have two admin users open the same order

**Steps:**
1. Admin A changes order to SHIPPED
2. Admin B changes same order to DELIVERED
3. Both confirm

**Expected:**
- Both requests succeed
- Last update wins
- No data corruption
- UI syncs after refresh

---

### Edge Case 3: Filter Applied During Status Change ✅

**Setup:**
1. Apply filter "PROCESSING"
2. Change a PROCESSING order to SHIPPED

**Expected:**
- Order removed from filtered view
- Filter remains active
- Only PROCESSING orders still visible
- No errors

---

## 🐛 TROUBLESHOOTING

### Issue: Dropdown still shows old statuses

**Check:**
1. Clear browser cache
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Verify frontend build: `npm run build` completed successfully

---

### Issue: FAILED_PICKUP orders still visible

**Check:**
1. Backend compiled correctly: `mvn clean compile`
2. Backend restarted after code changes
3. Database has order with FAILED_PICKUP status
4. Check backend logs for errors

---

### Issue: Backend returns 500 error on status update

**Check:**
1. Backend logs for stack trace
2. Verify `findByStatusIn` method exists in OrderRepository
3. Verify OrderStatus enum includes FAILED_PICKUP
4. Check database connection

---

## ✅ FINAL VERIFICATION CHECKLIST

Before marking as complete, verify:

- [ ] ✅ Dropdown shows exactly 4 statuses
- [ ] ✅ PROCESSING → SHIPPED works (stays in Active)
- [ ] ✅ PROCESSING → DELIVERED works (moves to Delivered)
- [ ] ✅ PROCESSING → FAILED_PICKUP works (disappears)
- [ ] ✅ Active tab shows only PROCESSING & SHIPPED
- [ ] ✅ Delivered tab shows only DELIVERED
- [ ] ✅ FAILED_PICKUP excluded from both tabs
- [ ] ✅ Backend validation rejects invalid statuses
- [ ] ✅ Persistence works after refresh
- [ ] ✅ Stats cards show correct counts
- [ ] ✅ No console errors
- [ ] ✅ Toast messages display correctly

---

## 📝 DATABASE VERIFICATION (Optional)

### Check Order Statuses in DB

```sql
-- Count orders by status
SELECT status, COUNT(*) as count 
FROM store.orders 
GROUP BY status 
ORDER BY count DESC;

-- Find FAILED_PICKUP orders (should exist but not visible in UI)
SELECT id, status, created_at 
FROM store.orders 
WHERE status = 'FAILED_PICKUP';

-- Verify PROCESSING and SHIPPED orders are visible
SELECT id, status, created_at 
FROM store.orders 
WHERE status IN ('PROCESSING', 'SHIPPED')
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🚀 PRODUCTION DEPLOYMENT NOTES

### Before Deployment:
1. ✅ All tests pass
2. ✅ Backend compiles
3. ✅ Frontend builds
4. ✅ Database backup created
5. ✅ Rollback plan prepared

### After Deployment:
1. Monitor backend logs for errors
2. Check admin orders page loads correctly
3. Verify status dropdown shows 4 options
4. Test one status change (PROCESSING → SHIPPED)
5. Verify FAILED_PICKUP hiding works

### Rollback Plan (if issues):
```bash
# Backend
git revert <commit-hash>
mvn clean package
# Restart backend

# Frontend
git revert <commit-hash>
npm run build
# Deploy frontend
```

---

## 📞 SUPPORT

**If any test fails:**
1. Check browser console (F12)
2. Check network tab for failed API calls
3. Check backend logs: `tail -f logs/application.log`
4. Refer to: `ORDER_STATUS_RESTRICTIONS_IMPLEMENTED.md` for implementation details

---

**Testing Time Estimate**: 15 minutes  
**Complexity**: Medium  
**Priority**: High (Production-Critical)  
**Status**: Ready for Testing ✅

