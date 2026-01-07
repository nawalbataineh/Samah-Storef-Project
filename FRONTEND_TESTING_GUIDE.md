# 🧪 FRONTEND TESTING GUIDE

## Quick Manual Testing Steps

### Prerequisites
1. Backend running on http://localhost:8080
2. Frontend running: `npm run dev`
3. Login as ADMIN user
4. Open browser DevTools Console

---

## TEST 1: Categories Status Toggle

**Steps**:
1. Navigate to `/admin/categories`
2. Find a category with "نشط" badge (active)
3. Click "تعطيل" button
4. **Expected**:
   - Button text changes to "جاري..."
   - Toast shows: "تم تعطيل الفئة بنجاح"
   - Badge changes to "غير نشط" (gray)
   - Button text changes to "تفعيل"
   - No page reload
5. Click "تفعيل" button again
6. **Expected**:
   - Badge changes back to "نشط" (green)
   - Button text changes back to "تعطيل"

**API Call to Verify**:
```
Network Tab:
PATCH /api/admin/categories/{id}/status?active=false
Response: 200 OK with updated category
```

---

## TEST 2: Categories Permanent Delete (Empty)

**Steps**:
1. Create a test category with NO products
2. Click "حذف نهائي" button (red)
3. **Expected**:
   - Modal opens with warning message
   - Title: "⚠️ تحذير: حذف نهائي من قاعدة البيانات"
   - Warning about no undo
4. Click "نعم، احذف نهائيًا"
5. **Expected**:
   - Toast: "تم حذف الفئة نهائيًا من قاعدة البيانات"
   - Category row disappears from table
   - Modal closes
   - No page reload

**API Call**:
```
DELETE /api/admin/categories/{id}/permanent
Response: 204 No Content
```

---

## TEST 3: Categories Permanent Delete (Has Products)

**Steps**:
1. Find a category that has products
2. Click "حذف نهائي"
3. Click "نعم، احذف نهائيًا"
4. **Expected**:
   - Toast shows error: "Cannot permanently delete category with X products..."
   - Category stays in table
   - Modal stays open (user can cancel)

**API Call**:
```
DELETE /api/admin/categories/{id}/permanent
Response: 409 Conflict
{
  "message": "Cannot permanently delete category with 5 products. Delete or reassign products first."
}
```

---

## TEST 4: Products Status Toggle

**Steps**:
1. Navigate to `/admin/products`
2. Find a product with "نشط" badge
3. Click "تعطيل" button
4. **Expected**: Same as categories test
5. Toggle back to active
6. **Expected**: Badge and button update correctly

**Additional Check**:
- Public storefront should NOT show inactive products
- Active products should appear in catalog

---

## TEST 5: Products Permanent Delete

**Steps**:
1. Create a test product with variants and images
2. Click "حذف نهائي"
3. **Expected**:
   - Modal warns about deleting variants and images
   - Message mentions potential cart/order conflicts
4. Click confirm
5. **Expected**:
   - Product disappears from table
   - Toast confirmation
   - No errors in console

**Database Verification**:
```sql
-- Product should be gone
SELECT * FROM products WHERE id = X;  -- Returns 0 rows

-- Variants should be gone
SELECT * FROM product_variants WHERE product_id = X;  -- Returns 0 rows

-- Images should be gone
SELECT * FROM product_images WHERE product_id = X;  -- Returns 0 rows
```

---

## TEST 6: Orders Active Tab

**Steps**:
1. Navigate to `/admin/orders`
2. **Expected**:
   - "الطلبات النشطة" tab is selected (pink indicator dot)
   - Table shows orders with status: NEW, PENDING, CONFIRMED, PROCESSING, SHIPPED
   - NO orders with status DELIVERED should appear
3. Check stats cards
4. **Expected**:
   - Numbers reflect only active orders

**API Call**:
```
GET /api/admin/orders?delivered=false&page=0&size=100&sort=id,desc
Response: Page with only non-delivered orders
```

---

## TEST 7: Orders Delivered Tab

**Steps**:
1. Click "الطلبات المُسلّمة" tab
2. **Expected**:
   - Tab indicator changes to green dot
   - Table reloads
   - Only orders with status DELIVERED appear
   - Stats update to show delivered counts
3. Pagination should work within delivered orders

**API Call**:
```
GET /api/admin/orders?delivered=true&page=0&size=100&sort=id,desc
Response: Page with only DELIVERED orders
```

---

## TEST 8: Order Status Change → Tab Movement

**Steps**:
1. Go to "الطلبات النشطة" tab
2. Find an order with status SHIPPED
3. Update status to DELIVERED using dropdown
4. Confirm the change
5. **Expected**:
   - Toast: "تم تحديث حالة الطلب بنجاح"
   - Order list refreshes
   - Order disappears from Active tab (because it's now delivered)
6. Switch to "الطلبات المُسلّمة" tab
7. **Expected**:
   - The order now appears in Delivered tab

**Stock Verification**:
```sql
-- Check that stock was decremented
SELECT stock_quantity FROM product_variants WHERE id = {variant_id};
-- Should be reduced by order quantity
```

---

## TEST 9: Double-Click Prevention

**Steps**:
1. Click "تعطيل" on a category
2. Immediately click it again (before request completes)
3. **Expected**:
   - Button is disabled (opacity-50)
   - Second click does nothing
   - Only ONE API call is made
4. After completion, button re-enables

---

## TEST 10: Error Handling

**Steps**:
1. Stop the backend server
2. Try to toggle a category status
3. **Expected**:
   - Toast shows error message
   - Button re-enables
   - UI state doesn't change
4. Restart backend and retry
5. **Expected**: Works normally

---

## TEST 11: RTL Layout

**Steps**:
1. Verify language is Arabic (RTL)
2. Check all tables align correctly (right-to-left)
3. Check modal text alignment
4. Check buttons are in correct positions
5. **Expected**: No layout breaks, all text readable

---

## TEST 12: Responsive Design

**Steps**:
1. Resize browser to mobile width (375px)
2. Check tables scroll horizontally
3. Check action buttons wrap correctly
4. Check tabs are readable
5. **Expected**: All features accessible on mobile

---

## AUTOMATED TESTING SCRIPT

```javascript
// Run in browser console on /admin/categories

// Test 1: Toggle status
const toggleBtn = document.querySelector('button:contains("تعطيل")');
console.log('Clicking toggle...');
toggleBtn.click();
setTimeout(() => {
  console.log('Status should be toggled now');
}, 2000);

// Test 2: Check optimistic update
const badge = document.querySelector('.bg-green-100');
console.log('Badge before:', badge?.textContent);
// Click toggle
// Badge should change immediately without reload
```

---

## EDGE CASES TO TEST

### Categories
- [ ] Toggle status with network delay
- [ ] Delete while another operation in progress
- [ ] Delete last category on page (pagination adjusts)
- [ ] Create → Immediate toggle → Works

### Products
- [ ] Toggle product with many variants
- [ ] Delete product with 0 variants (should succeed)
- [ ] Delete product in cart (should fail with clear message)
- [ ] Delete product in pending order (should fail)

### Orders
- [ ] Switch tabs rapidly (ensures only one request)
- [ ] Filter within active tab, then switch to delivered
- [ ] Assign employee, then mark as delivered
- [ ] Mark as delivered with insufficient stock (should fail)
- [ ] Mark as delivered twice (stock decrements only once)

---

## BROWSER CONSOLE CHECKS

**No errors should appear**:
```
✓ No "Cannot read property" errors
✓ No "undefined is not a function" errors
✓ No 404s for API calls
✓ No CORS errors
✓ No hydration warnings
```

**Network tab should show**:
```
✓ Clean request/response cycles
✓ Proper status codes (200, 204, 409)
✓ Correct Authorization headers
✓ JSON payloads as expected
```

---

## ACCESSIBILITY CHECKS

- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announcements (ARIA labels)
- [ ] Focus visible on buttons
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Modal traps focus properly

---

## PERFORMANCE CHECKS

- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] API calls only when needed
- [ ] No memory leaks (leave page open for 5 min, check memory)
- [ ] Smooth animations (no jank)

---

## FINAL SMOKE TEST (5 Minutes)

1. **Login** as ADMIN ✓
2. **Categories**: Toggle status ✓ Permanent delete ✓
3. **Products**: Toggle status ✓ Permanent delete ✓
4. **Orders**: Switch tabs ✓ Mark as delivered ✓
5. **Logout** and re-login ✓ State persists correctly ✓

**If all pass → READY FOR PRODUCTION** 🚀

---

## ROLLBACK PLAN

If critical issue found:
```bash
cd samah-store-frontend
git revert <commit-hash>
npm run build
# Redeploy
```

Backend stays unchanged (all new endpoints are additive).

---

**Testing Completion**: ⚠️ Pending Manual Testing
**Expected Time**: 30-45 minutes
**Blockers**: None
**Ready for**: QA Team / Manual Testing

