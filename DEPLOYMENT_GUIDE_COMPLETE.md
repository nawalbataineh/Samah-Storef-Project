# 🚀 SAMAH STORE - COMPLETE DEPLOYMENT GUIDE

**Target**: Production deployment with custom .tech domain  
**Difficulty**: Beginner-friendly  
**Time**: 2-3 hours  
**Cost**: ~$5-15/month

---

## 📊 PROJECT ANALYSIS

### What You Have
- **Backend**: Spring Boot 3.x (REST API)
  - Language: Java 17
  - Database: PostgreSQL
  - Port: 8080
  - Build: Maven

- **Frontend**: React + Vite
  - Framework: React 18
  - Build tool: Vite
  - Styling: Tailwind CSS
  - Port: 5173 (dev)

### What You Need to Deploy
1. ✅ Backend API server (always running)
2. ✅ PostgreSQL database (cloud-hosted)
3. ✅ Frontend static files (hosted on CDN)
4. ✅ Domain name (.tech)
5. ✅ HTTPS/SSL certificate

---

## 🎯 RECOMMENDED DEPLOYMENT APPROACH

### Best Option for Beginners: Railway + Vercel

**Why This Combination?**
- ✅ **Easy**: Click-based deployment (no complex commands)
- ✅ **Professional**: Production-grade infrastructure
- ✅ **Affordable**: Free tier available, then ~$5-10/month
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **Automatic Deployments**: Push code → auto-deploy
- ✅ **Custom Domain**: Easy .tech domain connection

### Architecture
```
User (samahstore.tech)
         ↓
    [Cloudflare DNS]
         ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Frontend              Backend
(Vercel)              (Railway)
HTTPS + CDN           HTTPS + Database
Static Files          API + PostgreSQL
```

---

## 💰 COST BREAKDOWN

### Monthly Costs (Estimated)
| Service | Free Tier | Paid Plan | Recommended |
|---------|-----------|-----------|-------------|
| **Railway** (Backend + DB) | $5 credit/month | $5/month + usage | Start free → $10/month |
| **Vercel** (Frontend) | Free forever | $20/month | Free tier (enough) |
| **Domain** (.tech) | - | $5-10/year | Required |
| **Cloudflare** (DNS + CDN) | Free forever | - | Free |
| **Total** | ~$0-5/month | ~$10-15/month | ~$10/month |

---

## 🛠️ STEP-BY-STEP DEPLOYMENT

### PHASE 1: PREPARE YOUR PROJECT (30 minutes)

#### 1.1 Update Backend Configuration for Production

I'll create a production configuration file for you:

**File: `src/main/resources/application-prod.yaml`**
```yaml
server:
  port: ${PORT:8080}
  servlet:
    session:
      cookie:
        same-site: lax
        secure: true
        http-only: true

spring:
  datasource:
    url: ${DATABASE_URL}
    hikari:
      maximum-pool-size: 5
      minimum-idle: 2
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
    show-sql: false
    properties:
      hibernate:
        default_schema: store
        format_sql: false
  servlet:
    multipart:
      enabled: true
      max-file-size: 5MB
      max-request-size: 10MB

app:
  jwt:
    secret: ${JWT_SECRET}
    access-minutes: 15
    refresh-days: 14
    issuer: "samah-store"
  upload:
    dir: ${UPLOAD_DIR:/tmp/uploads}
    base-url: ${UPLOAD_BASE_URL:/uploads}

logging:
  level:
    root: INFO
    com.samah.store: INFO
    org.hibernate: WARN
```

#### 1.2 Add Production Profile Activator

**File: `src/main/resources/application.yaml`** (update)
Add this at the top:
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
```

#### 1.3 Create Dockerfile for Backend

**File: `Dockerfile`** (create in project root)
```dockerfile
# Multi-stage build for smaller image
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /tmp/uploads && chmod 777 /tmp/uploads

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 1.4 Update Frontend Environment for Production

**File: `samah-store-frontend/.env.production`** (create)
```env
VITE_API_BASE_URL=https://api.samahstore.tech
```

#### 1.5 Add Railway Configuration

**File: `railway.json`** (create in project root)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "java -jar app.jar",
    "healthcheckPath": "/api/categories",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 1.6 Add Vercel Configuration

**File: `samah-store-frontend/vercel.json`** (create)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### PHASE 2: DEPLOY BACKEND (Railway) (45 minutes)

#### 2.1 Create Railway Account
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (recommended) or email
4. Verify your email

#### 2.2 Create PostgreSQL Database
1. In Railway dashboard, click "New Project"
2. Select "Provision PostgreSQL"
3. Wait 30 seconds for database to be ready
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. **Copy these values** (you'll need them):
   - `DATABASE_URL` (full connection string)

#### 2.3 Deploy Backend Application
1. Click "New Service" → "GitHub Repo"
2. Connect your GitHub account
3. Select your `samah.store-Project` repository
4. Railway will detect the Dockerfile automatically
5. Click "Deploy"

#### 2.4 Configure Environment Variables
1. Click on your backend service
2. Go to "Variables" tab
3. Add these variables:

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<paste from PostgreSQL service>
JWT_SECRET=<generate 64+ random characters>
PORT=8080
UPLOAD_DIR=/tmp/uploads
UPLOAD_BASE_URL=/uploads
```

**Generate JWT Secret**:
```bash
# Use this command or online generator
openssl rand -base64 64
```

Example:
```
JWT_SECRET=7X9kL2mP5qR8sT1vW4yZ6aC3dF0gH9jK2lN5pQ8rS1tU4wX7zA0bC3eF6hI9kL2m
```

#### 2.5 Run Database Migration
1. Click on PostgreSQL service
2. Go to "Data" tab
3. Click "Connect" → "Connect with psql" OR use any PostgreSQL client
4. Run these SQL commands:

```sql
-- Create schema
CREATE SCHEMA IF NOT EXISTS store;

-- Create admin user (IMPORTANT!)
INSERT INTO store.users (username, email, password_hash, role, enabled, deleted, token_version, created_at, updated_at)
VALUES (
  'admin',
  'admin@samahstore.tech',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye1IyXfJb7nGg7rjQcYRZ8qJ7ZqDq7ZHi', -- password: admin123
  'ADMIN',
  true,
  false,
  0,
  NOW(),
  NOW()
);
```

#### 2.6 Get Backend URL
1. Go to "Settings" tab
2. Click "Generate Domain"
3. You'll get something like: `samah-store-production.up.railway.app`
4. **Test it**: Open `https://samah-store-production.up.railway.app/api/categories`
5. Should return JSON (empty array is OK)

#### 2.7 Add Custom Domain for Backend
1. Still in Settings → "Domains"
2. Click "Custom Domain"
3. Enter: `api.samahstore.tech`
4. Railway will give you a CNAME record
5. **Save this CNAME** (you'll add it to Cloudflare later)

---

### PHASE 3: DEPLOY FRONTEND (Vercel) (30 minutes)

#### 3.1 Create Vercel Account
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Verify your email

#### 3.2 Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Select `samah.store-Project`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `samah-store-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3.3 Add Environment Variable
1. In "Environment Variables" section, add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://api.samahstore.tech`
   - **Environments**: Production, Preview, Development

2. Click "Deploy"

#### 3.4 Wait for Deployment
- First build takes 2-3 minutes
- You'll get a URL like: `samah-store.vercel.app`
- Click "Visit" to test
- Images may not load yet (we'll fix with domain)

#### 3.5 Add Custom Domain for Frontend
1. Go to "Settings" → "Domains"
2. Add domain: `samahstore.tech`
3. Also add: `www.samahstore.tech`
4. Vercel will give you DNS records
5. **Save these** (you'll add them to Cloudflare)

---

### PHASE 4: DOMAIN & DNS SETUP (Cloudflare) (30 minutes)

#### 4.1 Buy .tech Domain
1. Go to: https://get.tech or any domain registrar
2. Search for your domain (e.g., `samahstore.tech`)
3. Purchase for 1 year (~$5-10)
4. Complete registration

#### 4.2 Create Cloudflare Account
1. Go to: https://cloudflare.com
2. Sign up (free plan)
3. Verify email

#### 4.3 Add Domain to Cloudflare
1. Click "Add a Site"
2. Enter your domain: `samahstore.tech`
3. Select "Free" plan
4. Cloudflare will scan existing DNS records
5. Click "Continue"

#### 4.4 Update Nameservers at Registrar
1. Cloudflare will show you 2 nameservers like:
   ```
   anya.ns.cloudflare.com
   tim.ns.cloudflare.com
   ```
2. Go to your domain registrar (where you bought .tech)
3. Find "DNS Settings" or "Nameservers"
4. Change nameservers to Cloudflare's
5. Save (takes 5-60 minutes to propagate)

#### 4.5 Add DNS Records in Cloudflare
1. Wait for nameserver change to complete
2. Go to Cloudflare → "DNS" → "Records"
3. Add these records:

**For Frontend (Vercel):**
```
Type: A
Name: @
Content: 76.76.21.21
Proxy: ON (orange cloud)

Type: CNAME
Name: www
Content: cname.vercel-dns.com
Proxy: ON
```

**For Backend (Railway):**
```
Type: CNAME
Name: api
Content: <your-railway-app>.up.railway.app
Proxy: ON
```

#### 4.6 Enable HTTPS (Automatic)
1. Go to "SSL/TLS" → "Overview"
2. Select "Full (strict)"
3. Go to "Edge Certificates"
4. Enable:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Minimum TLS Version: 1.2

#### 4.7 Configure CORS in Backend
Make sure your backend allows requests from your domain.

**Update CORS in Spring Security Config**:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Arrays.asList(
        "https://samahstore.tech",
        "https://www.samahstore.tech",
        "http://localhost:5173" // Keep for development
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setExposedHeaders(Arrays.asList("Authorization"));
    config.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

---

### PHASE 5: VERIFICATION & TESTING (20 minutes)

#### 5.1 Test Backend API
```bash
# Test public endpoint
curl https://api.samahstore.tech/api/categories

# Should return JSON (even if empty)
```

#### 5.2 Test Frontend
1. Open: `https://samahstore.tech`
2. Check:
   - ✅ Page loads
   - ✅ Images display
   - ✅ Products load
   - ✅ Can add to cart
   - ✅ HTTPS padlock in browser

#### 5.3 Test Full Flow
1. Register a new customer
2. Browse products
3. Add to cart
4. Checkout
5. Login as admin: `admin@samahstore.tech` / `admin123`
6. Check orders in admin panel

#### 5.4 Monitor Logs
**Railway (Backend logs):**
1. Go to Railway dashboard
2. Click on backend service
3. Click "Deployments" → Latest deployment
4. Click "View Logs"
5. Check for errors

**Vercel (Frontend logs):**
1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments" → Latest
4. Click "Functions" or "Logs"

---

## 🔒 SECURITY CHECKLIST

### Before Going Live
- [ ] Change default admin password
- [ ] Generate strong JWT secret (64+ chars)
- [ ] Enable HTTPS (done via Cloudflare)
- [ ] Set secure cookies (`secure: true` in production)
- [ ] Validate all CORS origins
- [ ] Set strong database password
- [ ] Enable database backups (Railway auto-backups)
- [ ] Add rate limiting (optional but recommended)
- [ ] Review all environment variables
- [ ] Remove any hardcoded secrets from code

### Post-Launch
- [ ] Monitor logs daily (first week)
- [ ] Set up uptime monitoring (e.g., UptimeRobot - free)
- [ ] Create database backup manually
- [ ] Document admin credentials securely
- [ ] Test disaster recovery

---

## 📊 MONITORING & MAINTENANCE

### Free Monitoring Tools

#### 1. UptimeRobot (Free)
- Website: https://uptimerobot.com
- Monitor: `https://samahstore.tech` and `https://api.samahstore.tech`
- Get alerts via email/SMS if site goes down

#### 2. Cloudflare Analytics (Free)
- Built-in with Cloudflare
- See traffic, requests, bandwidth
- Security events

#### 3. Railway Metrics (Built-in)
- CPU, Memory, Network usage
- Database size and connections
- Request logs

#### 4. Vercel Analytics (Free tier)
- Page views
- Load times
- Core Web Vitals

### Regular Maintenance Tasks

**Daily** (First Week):
- Check logs for errors
- Monitor uptime status
- Test critical flows

**Weekly**:
- Review error logs
- Check database size
- Update dependencies if needed

**Monthly**:
- Database backup (manual download)
- Review costs
- Update SSL certificates (auto, just verify)

---

## 💾 BACKUP STRATEGY

### Database Backups

#### Automatic (Railway)
- Railway auto-backs up PostgreSQL
- Retention: 7 days on free tier
- Access: Railway dashboard → PostgreSQL → Backups

#### Manual Backup
```bash
# Install PostgreSQL client locally
# Then run:
pg_dump <DATABASE_URL> > backup-$(date +%Y%m%d).sql
```

#### Restore Backup
```bash
psql <DATABASE_URL> < backup-20260107.sql
```

### Code Backups
- Already on GitHub ✅
- Vercel keeps deployment history (7 days)
- Railway keeps build history

---

## 🚨 TROUBLESHOOTING

### Frontend Not Loading
**Problem**: White screen or "Cannot connect to server"
**Solutions**:
1. Check `VITE_API_BASE_URL` in Vercel env vars
2. Verify API is running: `curl https://api.samahstore.tech/api/categories`
3. Check browser console for CORS errors
4. Verify Cloudflare DNS propagated: `nslookup samahstore.tech`

### Backend 500 Error
**Problem**: API returns 500 Internal Server Error
**Solutions**:
1. Check Railway logs for stack trace
2. Verify database connection
3. Check environment variables are set
4. Verify schema `store` exists in database

### Images Not Displaying
**Problem**: Product images show broken
**Solutions**:
1. Check `uploads/` folder exists in container
2. Verify `UPLOAD_BASE_URL` matches API domain
3. Check file permissions
4. For production, consider using cloud storage (S3/Cloudinary)

### Database Connection Failed
**Problem**: Backend can't connect to PostgreSQL
**Solutions**:
1. Verify `DATABASE_URL` is set correctly
2. Check PostgreSQL service is running in Railway
3. Verify network connectivity
4. Check database credentials

### Domain Not Working
**Problem**: Domain doesn't resolve
**Solutions**:
1. Wait 24-48 hours for DNS propagation
2. Check nameservers: `dig NS samahstore.tech`
3. Verify DNS records in Cloudflare
4. Clear browser cache

### HTTPS Certificate Error
**Problem**: "Not Secure" warning in browser
**Solutions**:
1. Wait 5-10 minutes for Cloudflare SSL to activate
2. Check SSL/TLS mode is "Full (strict)"
3. Verify "Always Use HTTPS" is enabled
4. Clear browser cache and retry

---

## 💡 OPTIMIZATION TIPS

### Performance
1. **Enable Cloudflare Caching**:
   - Go to Cloudflare → Caching → Configuration
   - Set "Browser Cache TTL": 4 hours

2. **Compress Images**:
   - Use tools like TinyPNG before uploading
   - Or use Cloudflare Image Optimization (paid)

3. **Enable Brotli Compression**:
   - Cloudflare → Speed → Optimization
   - Enable "Brotli"

### Cost Savings
1. **Railway**:
   - Monitor usage dashboard
   - Scale down if over budget
   - Use "Sleep on inactivity" for dev environments

2. **Vercel**:
   - Free tier is generous
   - Only upgrade if you need more bandwidth

### SEO
1. **Add to Google Search Console**:
   - Verify ownership
   - Submit sitemap

2. **robots.txt** (create in `public/`):
```txt
User-agent: *
Allow: /
Sitemap: https://samahstore.tech/sitemap.xml
```

---

## 📞 SUPPORT & HELP

### Official Documentation
- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Cloudflare**: https://developers.cloudflare.com
- **Spring Boot**: https://spring.io/guides

### Community Support
- **Railway Discord**: https://discord.gg/railway
- **Vercel Discord**: https://discord.gg/vercel
- **Stack Overflow**: Tag your questions appropriately

### If You Get Stuck
1. Check error logs first (Railway/Vercel)
2. Google the exact error message
3. Ask in community Discord
4. Review this guide's troubleshooting section

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Code is committed to GitHub
- [ ] Tests pass locally
- [ ] Database schema is finalized
- [ ] Environment variables documented
- [ ] CORS origins listed

### Deployment
- [ ] Railway account created
- [ ] PostgreSQL provisioned
- [ ] Backend deployed to Railway
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Custom domain purchased
- [ ] Cloudflare configured
- [ ] DNS records added
- [ ] HTTPS enabled

### Post-Deployment
- [ ] All endpoints tested
- [ ] Full user flow tested
- [ ] Admin panel tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team trained (if applicable)

---

## 🎉 CONGRATULATIONS!

If you've followed all steps, your Samah Store is now live at:
- **Frontend**: https://samahstore.tech
- **Backend API**: https://api.samahstore.tech

You've successfully deployed a production-grade e-commerce platform! 🚀

---

**Next Steps**:
1. Test everything thoroughly
2. Monitor for 1 week daily
3. Gather user feedback
4. Plan feature updates
5. Scale as needed

**Remember**: Deployment is not a one-time task. Regular monitoring and updates keep your store running smoothly.

Good luck with your store! 🛍️

---

**Guide Version**: 1.0  
**Last Updated**: 2026-01-07  
**Author**: Senior DevOps Engineer

