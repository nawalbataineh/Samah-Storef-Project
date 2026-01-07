# Quick Start Guide - Hero Settings Feature

## Prerequisites
- PostgreSQL running on localhost:5432
- Database `samah_store` exists
- Java 17 installed
- Node.js installed

## Step 1: Start Backend

```bash
# Navigate to project root
cd C:\Users\ASUS\OneDrive\Desktop\samah.storef\samah.store-Project

# Clean and compile (this will resolve IDE errors)
.\mvnw clean compile

# Start Spring Boot
.\mvnw spring-boot:run
```

**Expected output:**
```
Started DemoApplication in X.XXX seconds
```

**Verify backend is running:**
Open browser: http://localhost:8080/api/public/hero

**Expected response:**
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

## Step 2: Start Frontend

Open a **new terminal:**

```bash
cd C:\Users\ASUS\OneDrive\Desktop\samah.storef\samah.store-Project\samah-store-frontend

# Install dependencies (if first time)
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 3: Test Homepage

1. Open browser: http://localhost:5173
2. Hero section should load with dynamic content from API
3. Verify hero shows:
   - Badge: "مجموعة جديدة"
   - Title: "أناقة عصرية" / "بلمسة مميزة"
   - Description: "اكتشفي تشكيلتنا..."
   - Button: "تسوّقي الآن"

## Step 4: Test Admin Hero Editor

1. Login as ADMIN user
2. Navigate to: http://localhost:5173/admin/hero
3. You should see a form with all hero fields pre-filled
4. Change any field (e.g., badgeText to "عرض خاص")
5. Click "حفظ الإعدادات"
6. Should see green toast: "تم تحديث إعدادات الهيرو بنجاح"
7. Navigate back to homepage (http://localhost:5173)
8. Hero should now show your updated content

## Step 5: Test Static Pages (404 Fix)

Visit these URLs and verify they load without 404:

- http://localhost:5173/about ✅
- http://localhost:5173/contact ✅
- http://localhost:5173/faq ✅
- http://localhost:5173/privacy ✅
- http://localhost:5173/terms ✅

**Test page refresh:**
1. Go to http://localhost:5173/about
2. Press F5 (refresh)
3. Page should reload without 404 ✅

## Step 6: Database Verification

Open PostgreSQL client:

```sql
-- Connect to database
\c samah_store

-- Switch to schema
SET search_path TO store;

-- View hero settings
SELECT * FROM hero_settings;
```

**Expected output:**
```
 id | badge_text      | title_line1    | title_line2   | ...
----+-----------------+----------------+---------------+-----
  1 | مجموعة جديدة    | أناقة عصرية    | بلمسة مميزة   | ...
```

## Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL is running
# Check database exists: samah_store
# Check application.yaml credentials match your PostgreSQL setup
```

### Frontend can't connect to backend
```bash
# Verify backend is running on port 8080
# Check browser console for CORS errors
# Verify VITE_API_BASE_URL in .env (should be http://localhost:8080)
```

### Hero doesn't update on homepage
```bash
# Clear browser cache
# Check Network tab in DevTools
# Verify GET /api/public/hero returns latest data
# Try hard refresh (Ctrl+Shift+R)
```

### Admin page shows 403 Forbidden
```bash
# Verify you're logged in as ADMIN (not CUSTOMER/EMPLOYEE)
# Check localStorage token is present
# Try logging out and back in
```

## Success Indicators

✅ Backend starts without errors  
✅ Database table `hero_settings` exists with 1 row  
✅ GET /api/public/hero returns JSON  
✅ Homepage hero shows dynamic content  
✅ Admin can access /admin/hero  
✅ Admin can edit and save hero settings  
✅ Static pages (/about, /contact, etc.) load without 404  
✅ Page refresh doesn't cause 404  

## Next Steps

1. **Add navigation link to admin sidebar:**
   - Edit admin layout component
   - Add link to `/admin/hero`

2. **Upload hero images:**
   - Use existing file upload controller
   - Update heroImageUrl field with uploaded path

3. **Deploy to production:**
   - Follow production build instructions in HERO_SETTINGS_IMPLEMENTATION_COMPLETE.md

---

**Need help?** Check HERO_SETTINGS_IMPLEMENTATION_COMPLETE.md for detailed documentation.

