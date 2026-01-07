# 🚀 QUICK DEPLOYMENT GUIDE - SAMAH STORE

**For Absolute Beginners** | **Time: 2-3 hours** | **Cost: ~$10/month**

---

## 📋 WHAT YOU NEED

✅ GitHub account (free)  
✅ .tech domain ($5-10/year)  
✅ Credit/debit card (for Railway - $5 minimum)  
✅ 2-3 hours of time  

---

## 🎯 5-PHASE DEPLOYMENT

### PHASE 1: PREPARE (15 min)

#### Step 1: Push Code to GitHub
```bash
cd C:\Users\ASUS\OneDrive\Desktop\samah.storef\samah.store-Project
git add .
git commit -m "Ready for deployment"
git push origin main
```

✅ **Verify**: Your code is on GitHub

---

### PHASE 2: DEPLOY BACKEND (45 min)

#### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

#### Step 2: Add PostgreSQL
1. Click "New Project" → "Provision PostgreSQL"
2. Wait 30 seconds
3. ✅ Database ready!

#### Step 3: Deploy Backend
1. Click "New Service" → "GitHub Repo"
2. Select: `samah.store-Project`
3. Wait 3-5 minutes for build
4. ✅ Backend deployed!

#### Step 4: Add Environment Variables
Click on backend service → "Variables" → Add:

```env
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<generate 64 random characters>
PORT=8080
UPLOAD_DIR=/tmp/uploads
UPLOAD_BASE_URL=/uploads
```

**Generate JWT Secret**:
Visit: https://generate-secret.vercel.app/64 or run:
```bash
openssl rand -base64 64
```

#### Step 5: Setup Database
1. Click PostgreSQL service → "Data" tab
2. Click "Connect" → Use any PostgreSQL client
3. Run this SQL:

```sql
CREATE SCHEMA IF NOT EXISTS store;

INSERT INTO store.users (username, email, password_hash, role, enabled, deleted, token_version, created_at, updated_at)
VALUES ('admin', 'admin@samahstore.tech', '$2a$10$N9qo8uLOickgx2ZMRZoMye1IyXfJb7nGg7rjQcYRZ8qJ7ZqDq7ZHi', 'ADMIN', true, false, 0, NOW(), NOW());
```

#### Step 6: Get Backend URL
1. Settings → "Generate Domain"
2. Copy URL (e.g., `your-app.up.railway.app`)
3. Test: Open `https://your-app.up.railway.app/api/categories`
4. ✅ Should return JSON

---

### PHASE 3: DEPLOY FRONTEND (30 min)

#### Step 1: Create Vercel Account
1. Go to: https://vercel.com
2. Sign in with GitHub

#### Step 2: Import Project
1. Click "Add New" → "Project"
2. Import: `samah.store-Project`
3. Configure:
   - **Root Directory**: `samah-store-frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://api.samahstore.tech` (will add later)
5. Click "Deploy"
6. Wait 2-3 minutes
7. ✅ Frontend deployed!

---

### PHASE 4: SETUP DOMAIN (45 min)

#### Step 1: Buy Domain
1. Go to: https://get.tech
2. Search: `samahstore.tech` (or your choice)
3. Purchase (~$5-10/year)

#### Step 2: Create Cloudflare Account
1. Go to: https://cloudflare.com
2. Sign up (free)

#### Step 3: Add Domain to Cloudflare
1. Click "Add a Site"
2. Enter your domain
3. Choose "Free" plan
4. Cloudflare will show nameservers like:
   ```
   anya.ns.cloudflare.com
   tim.ns.cloudflare.com
   ```

#### Step 4: Update Nameservers
1. Go to your domain registrar (where you bought .tech)
2. Find "DNS Settings"
3. Change nameservers to Cloudflare's
4. Save
5. Wait 30-60 minutes

#### Step 5: Add DNS Records
In Cloudflare → DNS → Records, add:

**Frontend:**
```
Type: A
Name: @
Content: 76.76.21.21
Proxy: ON
```

**Backend:**
```
Type: CNAME
Name: api
Content: <your-railway-url>.up.railway.app
Proxy: ON
```

#### Step 6: Connect Domains

**In Railway** (Backend):
1. Backend service → Settings → Domains
2. Add: `api.samahstore.tech`

**In Vercel** (Frontend):
1. Project → Settings → Domains
2. Add: `samahstore.tech`
3. Add: `www.samahstore.tech`

#### Step 7: Enable HTTPS
In Cloudflare → SSL/TLS:
1. Mode: "Full (strict)"
2. Enable: "Always Use HTTPS"
3. ✅ HTTPS enabled!

---

### PHASE 5: TEST & VERIFY (15 min)

#### Test Backend
```bash
curl https://api.samahstore.tech/api/categories
```
✅ Should return JSON

#### Test Frontend
1. Open: https://samahstore.tech
2. Check:
   - ✅ Page loads
   - ✅ No HTTPS errors
   - ✅ Can see products

#### Test Full Flow
1. Register new customer
2. Add product to cart
3. Checkout
4. Login as admin: `admin@samahstore.tech` / `admin123`
5. ✅ Everything works!

---

## 🎉 DONE!

Your store is now live at: **https://samahstore.tech**

---

## 🆘 QUICK TROUBLESHOOTING

### Frontend Shows "Cannot Connect"
→ Check `VITE_API_BASE_URL` in Vercel env variables

### Backend 500 Error
→ Check Railway logs for errors

### Domain Not Working
→ Wait 24 hours for DNS propagation

### Images Not Loading
→ Check browser console for errors

---

## 📚 NEED DETAILED HELP?

Read the complete guide: `DEPLOYMENT_GUIDE_COMPLETE.md`

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Backend responds to API calls
- [ ] Frontend loads without errors
- [ ] HTTPS works (green padlock)
- [ ] Can register/login
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Admin panel works
- [ ] Changed default admin password

---

**Total Time**: ~2-3 hours  
**Total Cost**: ~$10/month  
**Difficulty**: Beginner-friendly ✅

**Last Updated**: 2026-01-07

