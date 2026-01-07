# 🚀 SAMAH STORE - DEPLOYMENT GUIDE

## Complete Step-by-Step Deployment Instructions
**Zero Thinking Required - Just Follow the Steps**

---

## 📋 PREREQUISITES CHECKLIST

Before you start, make sure you have:
- [ ] GitHub account with this repo pushed
- [ ] Railway account (https://railway.app) - free tier works
- [ ] Vercel account (https://vercel.com) - free tier works
- [ ] Domain purchased (.tech or any domain)
- [ ] Access to domain DNS settings

---

## 🔧 PART 1: BACKEND DEPLOYMENT (Railway)

### Step 1.1: Create Railway Project
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select the repository: `samah.store-Project`
6. Railway will auto-detect Spring Boot

### Step 1.2: Add PostgreSQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for database to provision (1-2 minutes)
4. Click on the PostgreSQL service
5. Go to **"Variables"** tab
6. Copy the `DATABASE_URL` value (you'll need it)

### Step 1.3: Configure Backend Environment Variables
1. Click on your **Spring Boot service** (not PostgreSQL)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add these **EXACTLY**:

| Variable Name | Value |
|--------------|-------|
| `PORT` | `8080` |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | *(copy from PostgreSQL service - should auto-link)* |
| `JWT_SECRET` | `your-super-secret-64-char-minimum-random-string-change-this-now-12345678` |
| `CORS_ALLOWED_ORIGINS` | `https://YOUR_DOMAIN.tech,https://www.YOUR_DOMAIN.tech,https://your-app.vercel.app` |
| `UPLOAD_DIR` | `/tmp/uploads` |
| `UPLOAD_BASE_URL` | `/uploads` |

> ⚠️ **IMPORTANT**: Replace `YOUR_DOMAIN.tech` with your actual domain!

### Step 1.4: Deploy Backend
1. Railway will auto-deploy after adding variables
2. Wait for deployment (3-5 minutes)
3. Click **"Settings"** → **"Networking"**
4. Click **"Generate Domain"** to get a public URL
5. **COPY THIS URL** - you need it for frontend!

**Example Railway URL**: `https://samah-store-production.up.railway.app`

### Step 1.5: Verify Backend
Open in browser:
```
https://YOUR-RAILWAY-URL.railway.app/api/ping
```
You should see:
```json
{"status":"ok","service":"samah-store-api","timestamp":"..."}
```

---

## 🎨 PART 2: FRONTEND DEPLOYMENT (Vercel)

### Step 2.1: Create Vercel Project
1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose the repository: `samah.store-Project`
5. **IMPORTANT**: Set Root Directory to: `samah-store-frontend`

### Step 2.2: Configure Build Settings
Vercel should auto-detect Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `samah-store-frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Step 2.3: Add Environment Variable
1. In the **Environment Variables** section (same page)
2. Add this variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://YOUR-RAILWAY-URL.railway.app` |

> ⚠️ **IMPORTANT**: Use your actual Railway URL from Step 1.4!

### Step 2.4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll get a Vercel URL like: `https://samah-store.vercel.app`

### Step 2.5: Verify Frontend
1. Open your Vercel URL
2. Products should load from your Railway backend
3. Check browser DevTools → Network tab for API calls

---

## 🌐 PART 3: CUSTOM DOMAIN SETUP

### Step 3.1: Add Domain to Vercel
1. In Vercel, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `YOUR_DOMAIN.tech`
4. Click **"Add"**
5. Vercel will show required DNS records

### Step 3.2: Configure DNS Records
Go to your domain registrar's DNS settings and add:

#### For Root Domain (@):
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | Auto/3600 |

#### For WWW Subdomain:
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `cname.vercel-dns.com` | Auto/3600 |

### Step 3.3: Wait for DNS Propagation
- DNS changes take 5 minutes to 48 hours
- Usually works within 30 minutes
- Vercel will show "Valid Configuration" when ready
- HTTPS certificate is automatic!

### Step 3.4: Update CORS (After Domain Works)
1. Go back to Railway → Backend Variables
2. Update `CORS_ALLOWED_ORIGINS` to include your domain:
```
https://YOUR_DOMAIN.tech,https://www.YOUR_DOMAIN.tech
```

---

## ✅ PART 4: FINAL VERIFICATION CHECKLIST

### Backend Checks:
- [ ] `https://YOUR-RAILWAY-URL/api/ping` returns `{"status":"ok"}`
- [ ] `https://YOUR-RAILWAY-URL/api/products` returns products JSON
- [ ] `https://YOUR-RAILWAY-URL/api/categories` returns categories JSON

### Frontend Checks:
- [ ] Homepage loads with products
- [ ] Product images display correctly
- [ ] Navigation works (click products, categories)
- [ ] Login/Register forms work
- [ ] Cart functionality works

### Domain Checks:
- [ ] `https://YOUR_DOMAIN.tech` loads your store
- [ ] `https://www.YOUR_DOMAIN.tech` loads your store
- [ ] HTTPS padlock shows (secure)
- [ ] No mixed content warnings in console

---

## 🔥 QUICK REFERENCE

### Railway Environment Variables (COPY-PASTE)
```env
PORT=8080
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-super-secret-64-char-minimum-random-string-change-this-now-12345678
CORS_ALLOWED_ORIGINS=https://YOUR_DOMAIN.tech,https://www.YOUR_DOMAIN.tech
UPLOAD_DIR=/tmp/uploads
UPLOAD_BASE_URL=/uploads
```

### Vercel Environment Variables (COPY-PASTE)
```env
VITE_API_BASE_URL=https://YOUR-RAILWAY-URL.railway.app
```

### DNS Records Summary
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## 🆘 TROUBLESHOOTING

### "CORS Error" in Browser Console
→ Update `CORS_ALLOWED_ORIGINS` in Railway to include your exact frontend URL

### "502 Bad Gateway" on Railway
→ Check Railway logs, ensure `SPRING_PROFILES_ACTIVE=prod` is set

### Images Not Loading
→ Check if backend serves `/uploads/*` correctly
→ Verify `VITE_API_BASE_URL` is correct

### Login Not Working
→ Check `JWT_SECRET` is set in Railway
→ Check browser DevTools → Network for actual error

### Database Connection Failed
→ Ensure PostgreSQL is linked to your Spring Boot service in Railway
→ Check `DATABASE_URL` variable exists

---

## 📞 NEED HELP?

1. Railway Docs: https://docs.railway.app
2. Vercel Docs: https://vercel.com/docs
3. Check browser DevTools → Console for errors
4. Check Railway deployment logs for backend errors

---

**🎉 Congratulations! Your Samah Store is now live!**

