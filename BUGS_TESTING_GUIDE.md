# 🧪 CRITICAL BUGS - QUICK TESTING GUIDE

## Prerequisites
- Backend running: `http://localhost:8080`
- Frontend running: `http://localhost:5173` (or 5174)
- At least one test product in catalog
- Test user accounts: CUSTOMER and ADMIN

---

## 🎯 TEST #1: COUPON DISCOUNT (5 minutes)

### Setup
1. Login as CUSTOMER
2. Add product(s) to cart (total ~100 JOD)
3. Go to `/checkout`

### Test Steps

**Step 1: Apply Valid Coupon**
```
Action: Enter coupon code "SAVE10" (or create one in admin)
Click: "تطبيق"

✅ Expected:
- Green badge appears: "SAVE10"
- Discount line shows: "-10.00 دينار" (or correct %)
- Total updates: subtotal - discount + shipping
- NO page reload
```

**Step 2: Verify Calculation**
```
Example:
- Subtotal: 120.00 دينار
- Discount (SAVE10 - 10%): -12.00 دينار
- Shipping: 3.00 دينار
- Total: 111.00 دينار ✅

Check console: No errors
Check network tab: POST /api/coupons/apply → 200 OK
Response should have: { discount: 12.00 }
```

**Step 3: Remove Coupon**
```
Action: Click "إزالة" button

✅ Expected:
- Green badge disappears
- Discount line disappears
- Total = subtotal + shipping (back to 123.00)
```

**Step 4: Place Order**
```
Action: Re-apply coupon → Click "إتمام الطلب"

✅ Expected:
- Order created successfully
- Navigate to order details page
- Discount shows correctly in order summary
```

**Step 5: Admin Verification**
```
Action: Login as ADMIN → Navigate to /admin/orders
Find the test order → View details

✅ Expected:
- Discount Total: 12.00 (or correct amount)
- Grand Total: includes discount deduction
```

---

## 🎯 TEST #2: REVENUE RESET (3 minutes)

### Setup
1. Ensure there are delivered orders (revenue > 0)
2. Login as ADMIN
3. Go to `/admin/dashboard`

### Test Steps

**Step 1: Check Current Revenue**
```
Note the current revenue amount
Example: 1,250.00 د.أ

Check subtext: "إجمالي" or "منذ [date]"
```

**Step 2: Click Reset Button**
```
Action: Click "تصفير إجمالي الإيرادات"

✅ Expected:
- Modal opens with confirmation message
- Warning explains orders won't be deleted
```

**Step 3: Confirm Reset**
```
Action: Click confirm button in modal

✅ Expected:
- Toast: "تم تصفير إجمالي الإيرادات بنجاح"
- Modal closes
- Revenue KPI updates to: 0.00 د.أ
- Subtext changes to: "منذ [today's date]"
- NO page reload
```

**Step 4: Refresh Page**
```
Action: Press F5 or reload page

✅ Expected:
- Revenue still shows: 0.00 د.أ
- Subtext still shows today's date
- Delivered orders count UNCHANGED (not reset)
```

**Step 5: Database Verification (Optional)**
```sql
-- Check reset timestamp
SELECT * FROM store.admin_metric_config;

Expected:
id | revenue_reset_at
1  | 2026-01-05 12:30:45.123456 (current timestamp)
```

**Step 6: New Order Revenue**
```
Action:
1. Place new order as CUSTOMER
2. Admin marks it as DELIVERED
3. Refresh admin dashboard

✅ Expected:
- Revenue shows: [new order total]
- Only orders delivered AFTER reset are counted
```

---

## ✅ QUICK PASS/FAIL CHECKLIST

### Coupon Bug Fixed?
- [ ] Discount shows as number (not 0.00)
- [ ] Total decreases when coupon applied
- [ ] Total increases when coupon removed
- [ ] Order saves with correct discount
- [ ] Admin sees correct discount in order

### Revenue Bug Fixed?
- [ ] Revenue becomes 0.00 after reset
- [ ] Revenue stays 0.00 after refresh
- [ ] Date shows "منذ [today]"
- [ ] Delivered count NOT affected
- [ ] New orders accumulate from reset point

---

## 🐛 TROUBLESHOOTING

### Coupon shows 0.00 discount
**Check**:
- Network tab: Is `discount` field in response?
- Console: Any errors?
- API response format correct?
- Try different coupon (PERCENT vs FIXED)

### Revenue doesn't reset
**Check**:
- Network tab: POST /revenue-reset → 200 OK?
- Console: Any errors?
- Is user logged in as ADMIN?
- Check database: revenue_reset_at updated?

### Build errors
**Backend**:
```bash
cd samah.store-Project
.\mvnw.cmd clean compile
```

**Frontend**:
```bash
cd samah-store-frontend
npm run build
```

---

## 📞 SUPPORT

If tests fail:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Check backend logs
4. Refer to: `CRITICAL_BUGS_FIXED.md` for details

---

**Testing time**: ~8 minutes total
**Status**: Ready for QA ✅

