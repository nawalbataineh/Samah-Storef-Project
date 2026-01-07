# Frontend Integration Test - 10 Minute Checklist

## Pre-Test Setup (2 minutes)

### 1. Start Backend
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\samah.storef\samah.store-Project
.\mvnw.cmd spring-boot:run
```
Wait for: "Started DemoApplication"

### 2. Start Frontend  
```powershell
cd samah-store-frontend
npm run dev
```
Note the URL (e.g., http://localhost:5173)

### 3. Verify Database
Ensure you have:
- Admin user (username: admin, password: admin123)
- At least 1 product with image
- At least 1 category

---

## Test 1: Images Display (2 minutes)

### Home Page Images
1. Open home page (/)
2. Check: Hero section product image loads ✅
3. Check: "New Arrivals" product images load ✅
4. Open DevTools > Network
5. Filter: "Img"
6. Verify: Image URLs are `http://localhost:8080/uploads/...` ✅
7. Verify: All images return status 200 ✅

### Products Page Images
1. Navigate to /products
2. Check: All product card images display ✅
3. Open DevTools > Console
4. Verify: No 404 errors ✅

### Product Details Images
1. Click any product
2. Check: Main product image displays ✅
3. Check: Thumbnail images display (if multiple) ✅
4. Click thumbnails - main image changes ✅

**Pass Criteria**: All images visible, no broken image icons, no 404s

---

## Test 2: Customer Shopping Flow (3 minutes)

### Login as Customer
1. Go to /login
2. Login: `customer` / `customer123`
3. Verify: Redirects to home (or products) ✅
4. Verify: Username shows in header ✅

### Add to Cart
1. Go to /products
2. Click any product
3. Select a variant (size/color)
4. Set quantity: 2
5. Click "Add to Cart"
6. Verify: Success toast appears ✅
7. Verify: Cart badge updates (shows 2) ✅

### View Cart
1. Click cart icon or go to /cart
2. Verify: Product shows with correct image ✅
3. Verify: Quantity shows 2 ✅
4. Verify: Line total = price × 2 ✅
5. Verify: Subtotal is correct ✅

### Update Quantity
1. Click "+" to increase quantity to 3
2. Verify: Quantity updates immediately ✅
3. Verify: Line total updates ✅
4. Verify: Subtotal updates ✅
5. Click "-" to decrease to 2
6. Verify: Updates work ✅

### Checkout
1. Click "Proceed to Checkout"
2. If no address: Create one
   - City: Amman
   - Street: Test Street
   - Details: Apartment 1
   - Phone: 0791234567
3. Select the address ✅
4. (Optional) Enter coupon code if you have one
5. Verify: Order summary shows correct totals ✅
6. Click "Place Order"
7. Verify: Success message appears ✅
8. Verify: Redirects to orders or success page ✅
9. Verify: Cart is now empty ✅

**Pass Criteria**: Complete checkout without errors, order created

---

## Test 3: Admin Dashboard (3 minutes)

### Login as Admin
1. Logout (if logged in as customer)
2. Go to /login
3. Login: `admin` / `admin123`
4. Verify: Redirects to /admin/dashboard ✅
5. Verify: Dashboard shows metrics ✅

### View Orders
1. Click "Orders" in admin sidebar
2. Verify: Orders list displays ✅
3. Verify: The order you just placed appears ✅
4. Verify: Status shows "NEW" ✅
5. Click "Details" on the order
6. Verify: Full order details modal shows ✅
7. Verify: Customer info, address, items all visible ✅

### Update Order Status
1. In orders list, find a NEW order
2. Change status dropdown to "PROCESSING"
3. Confirm
4. Verify: Success toast appears ✅
5. Verify: Status updates in table ✅
6. Change status to "SHIPPED"
7. Verify: Success (no stock error) ✅
8. Change status to "DELIVERED"
9. Verify: Order disappears from Active tab ✅
10. Click "Delivered" tab
11. Verify: Order appears here ✅

### Try Failed Pickup
1. Go back to Active tab
2. Find a SHIPPED order
3. Change status to "FAILED_PICKUP"
4. Verify: Order disappears from list ✅
5. Check both Active and Delivered tabs
6. Verify: Order not in either (correct) ✅

### View Products
1. Click "Products" in admin sidebar
2. Verify: Products list displays ✅
3. Verify: Product images show in table ✅
4. Verify: All product data visible ✅

### View Metrics
1. Go to Admin Dashboard
2. Verify: Total Orders count is correct ✅
3. Verify: Revenue shows (if any delivered orders) ✅
4. Note current revenue value
5. Click "Reset Revenue" button
6. Confirm in modal
7. Verify: Revenue becomes 0.00 ✅
8. Refresh page
9. Verify: Revenue still 0.00 ✅

**Pass Criteria**: All admin operations work, data displays correctly

---

## Test 4: Employee Dashboard (2 minutes - Optional)

### Login as Employee (if employee exists)
1. Logout
2. Login as employee
3. Verify: Redirects to /employee/dashboard ✅
4. Verify: Assigned orders show ✅
5. Try updating order status
6. Verify: Limited to allowed statuses ✅

**Skip if no employee user**

---

## Final Verification Checklist

### Images ✅
- [ ] Home page images load
- [ ] Product cards show images
- [ ] Product details images work
- [ ] Cart shows product images
- [ ] Admin product list shows images
- [ ] No 404 image errors in console

### Customer Flow ✅
- [ ] Login works
- [ ] Add to cart works
- [ ] Cart displays correctly
- [ ] Update quantity works
- [ ] Checkout completes
- [ ] Order appears in admin

### Admin Flow ✅
- [ ] Admin login redirects to dashboard
- [ ] Orders list works
- [ ] Status update works (all transitions)
- [ ] DELIVERED moves to Delivered tab
- [ ] FAILED_PICKUP disappears
- [ ] Products list works
- [ ] Metrics display
- [ ] Revenue reset works

### Build & Performance ✅
- [ ] `npm run build` completes without errors
- [ ] No console errors in browser
- [ ] Page load is fast
- [ ] Images load quickly

---

## Common Issues & Quick Fixes

### Images Not Loading
- Check: Backend is running on port 8080
- Check: `/uploads` folder exists in backend
- Check: Products have `primaryImageUrl` in database
- Check: DevTools Network tab for actual error

### 401 Errors
- Check: Token is present in localStorage
- Check: Token not expired
- Try: Logout and login again

### Cart Empty After Refresh
- Check: Using correct endpoint (GET /api/cart)
- Check: Authorization header attached
- Check: CartContext refreshCart on mount

### Status Update Fails
- Check: Backend logs for exact error
- Check: Sending enum values (not Arabic labels)
- Check: Order status allows transition

### Build Fails
- Run: `npm install`
- Clear cache: `rm -rf node_modules/.vite`
- Try: `npm run build` again

---

## Success Criteria

**All tests PASS** = ✅ Frontend integration complete and production-ready

**Any test FAILS** = Needs immediate fix:
1. Note exact error message
2. Check Browser console + Network tab
3. Check Backend logs
4. Apply minimal fix
5. Re-test

---

## Estimated Time

- Setup: 2 minutes
- Images test: 2 minutes
- Customer flow: 3 minutes  
- Admin flow: 3 minutes
- **Total: 10 minutes**

---

**Last Updated**: 2026-01-05
**Status**: Ready to execute

