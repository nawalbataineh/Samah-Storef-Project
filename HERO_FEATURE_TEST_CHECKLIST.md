# 🧪 HERO SETTINGS E2E TEST CHECKLIST

## ✅ BACKEND TESTS

### Test 1: Public Hero Endpoint (No Auth Required)
**URL:** `GET http://localhost:8080/api/public/hero`

**How to test:**
```bash
curl http://localhost:8080/api/public/hero
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "badgeText": "مجموعة جديدة",
  "titleLine1": "أناقة عصرية",
  "titleLine2": "بلمسة مميزة",
  "description": "اكتشفي تشكيلتنا المختارة بعناية من الأزياء العصرية التي تعكس ذوقك الراقي",
  "ctaText": "تسوّقي الآن",
  "ctaLink": "/products",
  "heroImageUrl": "/assets/heroImage.jpg",
  "updatedAt": "2026-01-04T..."
}
```

**Verify:**
- ✅ Returns 200 status
- ✅ All fields present (badgeText, titleLine1, titleLine2, description, ctaText, ctaLink, heroImageUrl, updatedAt)
- ✅ Default Arabic content if first request
- ✅ No authentication required

---

### Test 2: Admin Hero GET (Requires ADMIN Token)
**URL:** `GET http://localhost:8080/api/admin/hero`

**How to test without token:**
```bash
curl http://localhost:8080/api/admin/hero
```

**Expected Response (403 Forbidden):**
```json
{
  "timestamp": "...",
  "status": 403,
  "error": "Forbidden"
}
```

**How to test WITH admin token:**
1. Login as ADMIN at `http://localhost:5173/login`
2. Open DevTools → Application → Local Storage
3. Copy the `token` value
4. Use in header:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:8080/api/admin/hero
```

**Expected Response (200 OK):** Same structure as public endpoint

**Verify:**
- ✅ Returns 403 without token
- ✅ Returns 200 with valid ADMIN token
- ✅ Returns same data as public endpoint

---

### Test 3: Admin Hero PUT (Update)
**URL:** `PUT http://localhost:8080/api/admin/hero`

**How to test (with Postman/curl):**
```bash
curl -X PUT http://localhost:8080/api/admin/hero \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "badgeText": "عرض خاص",
    "titleLine1": "تخفيضات كبيرة",
    "titleLine2": "حتى 50%",
    "description": "استفيدي من عروضنا الحصرية على جميع المنتجات",
    "ctaText": "اشتري الآن",
    "ctaLink": "/products",
    "heroImageUrl": "/assets/heroImage.jpg"
  }'
```

**Expected Response (200 OK):** Updated hero settings object

**Verify:**
- ✅ Returns 403 without token
- ✅ Returns 400 if ctaLink doesn't start with "/"
- ✅ Returns 400 if required fields missing
- ✅ Returns 400 if field lengths exceed limits
- ✅ Returns 200 and updates database with valid request

---

## ✅ FRONTEND TESTS

### Test 4: Homepage Hero Display (Public)
**URL:** `http://localhost:5173/`

**Steps:**
1. Open homepage in browser (logged out)
2. Wait for page to load

**Verify:**
- ✅ Hero section displays at top of page
- ✅ Badge text shows: "مجموعة جديدة" (or custom value)
- ✅ Title line 1 shows: "أناقة عصرية"
- ✅ Title line 2 (colored) shows: "بلمسة مميزة"
- ✅ Description paragraph displays
- ✅ CTA button shows: "تسوّقي الآن"
- ✅ Hero image displays correctly
- ✅ No console errors
- ✅ Loading skeleton appears briefly then content loads

**Check Network:**
- Open DevTools → Network
- Should see: `GET /api/public/hero` with status 200

---

### Test 5: Admin Hero Settings Page Access
**URL:** `http://localhost:5173/admin/hero`

**Steps:**
1. Open URL directly in browser (NOT logged in)

**Expected:** Redirect to `/login`

**Then:**
2. Login as ADMIN user
3. Navigate to Admin Dashboard: `http://localhost:5173/admin/dashboard`

**Verify:**
- ✅ See "إعدادات الهيرو" card in Quick Links section (rose/pink color, Image icon)
- ✅ Click card → navigates to `/admin/hero`

**OR:**
4. Directly visit: `http://localhost:5173/admin/hero` (while logged in as ADMIN)

**Verify:**
- ✅ Page loads without redirect
- ✅ Form displays with 7 input fields:
  - نص الشارة (Badge)
  - السطر الأول من العنوان
  - السطر الثاني من العنوان (ملون)
  - الوصف (textarea)
  - نص زر الحث على الإجراء (CTA)
  - رابط الزر (CTA Link)
  - رابط صورة الهيرو
- ✅ All fields pre-filled with current values
- ✅ Character counters show (e.g., "15 / 60")
- ✅ Image preview displays at bottom (if URL valid)
- ✅ RTL layout (Arabic text aligned right)

---

### Test 6: Edit and Save Hero Settings
**URL:** `http://localhost:5173/admin/hero`

**Steps:**
1. Login as ADMIN
2. Navigate to `/admin/hero`
3. Change **badgeText** to: `عرض خاص`
4. Change **titleLine1** to: `تخفيضات رائعة`
5. Click "حفظ الإعدادات" button

**Verify:**
- ✅ Button shows "جاري الحفظ..." while saving
- ✅ Green toast appears: "تم تحديث إعدادات الهيرو بنجاح"
- ✅ Form reloads with updated values
- ✅ No errors in console

**Then:**
6. Open homepage in new tab: `http://localhost:5173/`

**Verify:**
- ✅ Hero badge now shows: "عرض خاص"
- ✅ Hero title line 1 shows: "تخفيضات رائعة"
- ✅ Changes are visible immediately (or after refresh)

---

### Test 7: Upload Hero Image
**URL:** `http://localhost:5173/admin/hero`

**Steps:**
1. Login as ADMIN
2. Navigate to `/admin/hero`
3. Scroll to "رفع صورة الهيرو من جهازك" section
4. Click file input and select an image (PNG/JPG) from your device
5. Verify preview appears below
6. Click "رفع الصورة" button

**Verify:**
- ✅ File input accepts only images
- ✅ Preview displays selected image before upload
- ✅ Button shows "جاري الرفع..." during upload
- ✅ Green toast appears: "تم رفع الصورة بنجاح"
- ✅ heroImageUrl field updates with: `/uploads/hero/<uuid>.ext`
- ✅ Preview shows uploaded image
- ✅ File input clears after successful upload

**Then:**
7. Click "حفظ الإعدادات" to save
8. Visit homepage: `http://localhost:5173/`

**Verify:**
- ✅ Hero displays the newly uploaded image
- ✅ Image loads correctly from `/uploads/hero/...`

**Backend Verification:**
```bash
# Check uploaded file exists
ls uploads/hero/
# Should see the uploaded file with UUID name
```

---

### Test 8: Upload Validation
**URL:** `http://localhost:5173/admin/hero`

**Test file size limit:**
1. Try uploading an image larger than 5MB

**Verify:**
- ✅ Red toast appears: "حجم الملف يجب ألا يتجاوز 5 ميجابايت"
- ✅ Upload rejected, no network request

**Test file type:**
2. Try uploading a non-image file (PDF, TXT, etc.)

**Verify:**
- ✅ Red toast appears: "يرجى اختيار ملف صورة"
- ✅ Upload rejected

---

### Test 9: Validation Errors
**URL:** `http://localhost:5173/admin/hero`

**Steps:**
1. Clear **badgeText** field (leave empty)
2. Click "حفظ الإعدادات"

**Verify:**
- ✅ Red error message appears: "نص الشارة مطلوب"
- ✅ No network request sent
- ✅ Field border turns red

**Steps:**
3. Fill **badgeText** with valid text
4. Change **ctaLink** to: `products` (without leading "/")
5. Click "حفظ الإعدادات"

**Verify:**
- ✅ Red error message: "الرابط يجب أن يبدأ بـ /"
- ✅ No network request sent

**Steps:**
6. Fix **ctaLink** to: `/products`
7. Type 70 characters in **badgeText** (exceeds 60 limit)

**Verify:**
- ✅ Character counter shows: "70 / 60" (or similar)
- ✅ Red error message: "الحد الأقصى 60 حرف"
- ✅ Cannot save

---

### Test 10: Static Pages Routing
**Test each URL:**

| URL | Expected Page Title | Verify Content |
|-----|-------------------|----------------|
| `http://localhost:5173/about` | "من نحن" | ✅ AboutPage loads, shows company info |
| `http://localhost:5173/contact` | "تواصل معنا" | ✅ ContactPage loads, shows form |
| `http://localhost:5173/faq` | FAQ section | ✅ FAQPage loads, shows Q&A |
| `http://localhost:5173/privacy` | "سياسة الخصوصية" | ✅ PrivacyPolicyPage loads |
| `http://localhost:5173/terms` | "الشروط والأحكام" | ✅ TermsPage loads |

**For each page:**
1. Direct navigation (paste URL in address bar)
2. Press F5 to refresh

**Verify:**
- ✅ Page loads without 404
- ✅ Refresh works (no 404)
- ✅ PublicLayout header/footer visible
- ✅ Content displays correctly

**Footer Links:**
1. Scroll to footer on homepage
2. Find "الشركة" section
3. Click links:
   - "عن سماح" → `/about`
   - "سياسة الخصوصية" → `/privacy`
   - "الشروط والأحكام" → `/terms`

**Verify:**
- ✅ All links navigate correctly
- ✅ No broken links

---

## ✅ DATABASE VERIFICATION

### Test 11: Default Row Creation
**Steps:**
1. Connect to PostgreSQL:
```bash
psql -U postgres -d samah_store
```

2. Check if `hero_settings` table exists:
```sql
SET search_path TO store;
SELECT * FROM hero_settings;
```

**Expected (if never accessed):** Empty table (0 rows)

**Then:**
3. Make first API call:
```bash
curl http://localhost:8080/api/public/hero
```

4. Re-check database:
```sql
SELECT * FROM hero_settings;
```

**Expected:** 1 row with default Arabic content

**Verify:**
- ✅ Table has exactly 1 row (id = 1)
- ✅ `badge_text` = "مجموعة جديدة"
- ✅ `title_line1` = "أناقة عصرية"
- ✅ `title_line2` = "بلمسة مميزة"
- ✅ `cta_link` = "/products"
- ✅ `created_at` and `updated_at` timestamps present

---

### Test 12: Update Persistence
**Steps:**
1. Update hero via admin UI (Test 6)
2. Check database:
```sql
SELECT badge_text, title_line1, updated_at FROM store.hero_settings;
```

**Verify:**
- ✅ `badge_text` matches new value
- ✅ `title_line1` matches new value
- ✅ `updated_at` timestamp changed

3. Restart Spring Boot application
4. Call API again:
```bash
curl http://localhost:8080/api/public/hero
```

**Verify:**
- ✅ Returns updated values (not defaults)
- ✅ Changes survived restart

---

## 🎯 FULL E2E WORKFLOW TEST

### Complete User Journey
1. ✅ **Public user visits homepage** → sees default hero
2. ✅ **Admin logs in** → redirected to `/admin/dashboard`
3. ✅ **Admin clicks "إعدادات الهيرو"** → navigates to `/admin/hero`
4. ✅ **Admin edits hero** → changes text, saves successfully
5. ✅ **Admin logs out** → visits homepage
6. ✅ **Homepage shows updated hero** → changes are visible
7. ✅ **Public user clicks footer links** → static pages load
8. ✅ **Public user refreshes static page** → no 404
9. ✅ **Database persists changes** → survives server restart

---

## 📋 QUICK SMOKE TEST (30 seconds)

```bash
# 1. Backend is running
curl http://localhost:8080/api/public/hero | jq .badgeText

# 2. Frontend dev server running
# Visit: http://localhost:5173/
# See hero section ✓

# 3. Admin access works
# Visit: http://localhost:5173/admin/dashboard
# See "إعدادات الهيرو" card ✓

# 4. Static pages work
# Visit: http://localhost:5173/about
# Page loads (not 404) ✓
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot GET /api/public/hero"
**Fix:** Backend not running. Start with: `mvnw spring-boot:run`

### Issue: Homepage hero shows fallback (not from DB)
**Fix:** 
- Check browser console for CORS errors
- Verify backend is on port 8080
- Check `VITE_API_BASE_URL` in frontend `.env`

### Issue: Admin hero page shows 403
**Fix:**
- Verify logged in user has role = ADMIN (not CUSTOMER)
- Check localStorage token is present
- Try logout and login again

### Issue: Static pages return 404
**Fix:**
- Verify routes registered in `AppRoutes.jsx`
- Check SpaForwardController is deployed
- In production: verify `index.html` forwarding configured

### Issue: Hero changes don't persist
**Fix:**
- Check PostgreSQL is running
- Verify `application.yaml` datasource config
- Check schema: `store` exists
- Run: `SELECT * FROM store.hero_settings;`

---

## ✅ ALL TESTS PASSED CRITERIA

- [x] Public endpoint returns 200 without auth
- [x] Admin endpoints require ADMIN role (403 without token)
- [x] Default row auto-created with Arabic content
- [x] Homepage displays hero from API
- [x] Admin can navigate to `/admin/hero` from dashboard
- [x] Admin can edit and save hero settings
- [x] Changes appear on homepage immediately
- [x] Validation works (required fields, ctaLink format, max lengths)
- [x] Static pages accessible via routes
- [x] Footer links work
- [x] Page refresh works (no 404)
- [x] Database persists changes across restarts

**Status:** 🎉 Feature is production-ready

