# 📊 MONITORING & MAINTENANCE GUIDE

**For**: Samah Store Production Environment  
**Last Updated**: 2026-01-07

---

## 🎯 MONITORING SETUP (Free Tools)

### 1. UptimeRobot (Uptime Monitoring)

**What it does**: Alerts you when your site goes down

**Setup** (5 minutes):
1. Go to: https://uptimerobot.com
2. Sign up (free)
3. Add monitors:
   - **Monitor 1**: `https://samahstore.tech` (check every 5 min)
   - **Monitor 2**: `https://api.samahstore.tech/api/categories` (check every 5 min)
4. Add alert contacts (email/SMS)
5. ✅ Done!

**Cost**: Free (50 monitors, 5-min intervals)

---

### 2. Cloudflare Analytics (Traffic Monitoring)

**What it does**: Shows visitors, requests, bandwidth

**Setup** (Already done!):
1. Go to Cloudflare dashboard
2. Select your domain
3. Click "Analytics"

**Key Metrics to Watch**:
- Total Requests
- Bandwidth Used
- Threats Blocked
- Cache Hit Rate

---

### 3. Railway Metrics (Backend Performance)

**What it does**: CPU, Memory, Network usage

**How to Access**:
1. Railway dashboard
2. Click on backend service
3. Click "Metrics" tab

**Key Metrics**:
- CPU Usage (should be <50%)
- Memory Usage (should be <80%)
- Network I/O
- Request count

---

### 4. Vercel Analytics (Frontend Performance)

**What it does**: Page views, load times

**How to Access**:
1. Vercel dashboard
2. Click on project
3. Click "Analytics" tab

**Key Metrics**:
- Page Views
- Core Web Vitals
- Top Pages
- Visitor Countries

---

## 📅 MAINTENANCE SCHEDULE

### Daily (First Week Only)

**Time**: 5 minutes  
**What to Check**:
- [ ] UptimeRobot: Any downtime alerts?
- [ ] Railway logs: Any errors?
- [ ] User reports: Any issues?
- [ ] Quick test: Login and browse

**How**:
1. Check email for UptimeRobot alerts
2. Open Railway → Deployments → View Logs
3. Scan for ERROR or WARN messages

---

### Weekly

**Time**: 15 minutes  
**What to Check**:
- [ ] Error logs (backend)
- [ ] Database size
- [ ] Disk usage
- [ ] Response times
- [ ] Security alerts

**How**:
1. Railway → PostgreSQL → Metrics
2. Check database size (should be < 1GB on free tier)
3. Cloudflare → Security Events → Review threats
4. Run test checkout flow

---

### Monthly

**Time**: 30 minutes  
**What to Do**:
- [ ] Download database backup
- [ ] Review costs
- [ ] Update dependencies (if needed)
- [ ] Review analytics
- [ ] Test disaster recovery

---

## 💾 BACKUP PROCEDURES

### Automatic Backups (Railway)

**What**: Railway auto-backs up PostgreSQL  
**Retention**: 7 days  
**How to Restore**:
1. Railway → PostgreSQL → Backups
2. Select backup
3. Click "Restore"

---

### Manual Database Backup

**When**: Monthly (or before major changes)

**Step 1**: Install PostgreSQL client locally
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/
```

**Step 2**: Get DATABASE_URL from Railway
1. Railway → PostgreSQL → Variables
2. Copy `DATABASE_URL`

**Step 3**: Create backup
```bash
# Replace <DATABASE_URL> with actual URL
pg_dump "<DATABASE_URL>" > backup-2026-01-07.sql
```

**Step 4**: Store backup safely
- Save to external drive
- Or upload to Google Drive / Dropbox
- Keep at least 3 recent backups

---

### Restore from Backup

```bash
# Replace <DATABASE_URL> with actual URL
psql "<DATABASE_URL>" < backup-2026-01-07.sql
```

⚠️ **Warning**: This will overwrite current data!

---

## 🚨 INCIDENT RESPONSE

### Site is Down (500/502/503 Error)

**Immediate Actions** (2 minutes):
1. Check UptimeRobot status
2. Open Railway → Backend service
3. Check "Deployments" → Latest deployment status
4. If failed: Click "Redeploy"

**If Still Down**:
1. Check Railway logs for errors
2. Check PostgreSQL service status
3. Restart backend service
4. Check environment variables

---

### Database Connection Error

**Symptoms**: Backend logs show "Connection refused"

**Fix**:
1. Railway → PostgreSQL service
2. Check status (should be "Active")
3. If stopped: Click "Restart"
4. Verify `DATABASE_URL` in backend env vars
5. Redeploy backend

---

### Frontend Not Loading

**Symptoms**: White screen or "Failed to load"

**Fix**:
1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` in Vercel
3. Test backend API directly
4. Check Cloudflare status
5. Redeploy frontend if needed

---

### Images Not Displaying

**Symptoms**: Broken image icons

**Fix**:
1. Check uploads folder exists in container
2. Verify file permissions
3. Test image URL directly
4. Check CORS headers
5. Consider moving to cloud storage (S3/Cloudinary)

---

## 📈 PERFORMANCE OPTIMIZATION

### Backend Optimization

**If Response Time > 1 second**:
1. Enable database query logging
2. Check for N+1 queries
3. Add database indexes
4. Enable Redis caching (advanced)
5. Scale up Railway plan

**How to Check Response Time**:
- Cloudflare Analytics → Performance
- Or use: https://tools.pingdom.com

---

### Frontend Optimization

**If Load Time > 3 seconds**:
1. Check bundle size in Vercel build logs
2. Enable code splitting
3. Compress images (TinyPNG)
4. Enable Cloudflare caching
5. Use lazy loading for images

**How to Check**:
- Vercel Analytics → Core Web Vitals
- Or use: https://pagespeed.web.dev

---

### Database Optimization

**If Queries are Slow**:
1. Railway → PostgreSQL → Metrics
2. Check "Connections" (should be < 10)
3. Add indexes to frequently queried columns
4. Review slow query logs
5. Consider upgrading database plan

---

## 💰 COST MANAGEMENT

### Monitor Monthly Costs

**Railway**:
1. Dashboard → Usage
2. Check current month spending
3. Alert: If > $10, investigate

**Vercel**:
1. Dashboard → Usage
2. Check bandwidth (free tier: 100GB)
3. Usually stays free for small stores

---

### Reduce Costs

**If Railway bill is high**:
1. Check which service uses most resources
2. Optimize database queries
3. Enable "Sleep on inactivity" for dev environments
4. Consider scaling down during low-traffic hours

---

## 🔒 SECURITY MAINTENANCE

### Monthly Security Checklist

- [ ] Review Railway access logs
- [ ] Check Cloudflare security events
- [ ] Scan for dependency vulnerabilities
- [ ] Review admin user activities
- [ ] Rotate JWT secret (every 3 months)
- [ ] Update Spring Boot (if security patch)

---

### How to Rotate JWT Secret

**When**: Every 90 days or if compromised

**Steps**:
1. Generate new secret:
   ```bash
   openssl rand -base64 64
   ```
2. Railway → Backend → Variables
3. Update `JWT_SECRET`
4. Click "Restart"
5. ⚠️ Note: All users will need to re-login

---

## 📊 METRICS TO TRACK

### Business Metrics

| Metric | Where to Find | Target |
|--------|---------------|--------|
| Daily Active Users | Vercel Analytics | Growing |
| Order Conversion Rate | Database query | > 2% |
| Average Order Value | Database query | Growing |
| Cart Abandonment | Database query | < 70% |

### Technical Metrics

| Metric | Where to Find | Target |
|--------|---------------|--------|
| Uptime | UptimeRobot | > 99.9% |
| Response Time (API) | Railway Metrics | < 500ms |
| Page Load Time | Vercel Analytics | < 3s |
| Error Rate | Railway Logs | < 0.1% |

---

## 🛠️ TOOLS REFERENCE

### Essential Tools

| Tool | Purpose | Cost | Link |
|------|---------|------|------|
| UptimeRobot | Uptime monitoring | Free | https://uptimerobot.com |
| Cloudflare | DNS + CDN + Security | Free | https://cloudflare.com |
| Railway | Backend + Database | $5-10/mo | https://railway.app |
| Vercel | Frontend hosting | Free | https://vercel.com |
| PostgreSQL client | Database access | Free | https://www.postgresql.org |

### Optional Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Sentry | Error tracking | Free tier | https://sentry.io |
| LogRocket | Session replay | Free tier | https://logrocket.com |
| Cloudinary | Image hosting | Free tier | https://cloudinary.com |

---

## 📞 EMERGENCY CONTACTS

### Service Status Pages

- **Railway**: https://railway.statuspage.io
- **Vercel**: https://www.vercel-status.com
- **Cloudflare**: https://www.cloudflarestatus.com

### Support

- **Railway Discord**: https://discord.gg/railway
- **Vercel Support**: support@vercel.com
- **Cloudflare Community**: https://community.cloudflare.com

---

## ✅ MONTHLY CHECKLIST

```
[ ] Download database backup
[ ] Review error logs
[ ] Check uptime percentage (should be >99%)
[ ] Review costs
[ ] Update dependencies (if security patches)
[ ] Test checkout flow
[ ] Review user feedback
[ ] Check disk usage
[ ] Verify SSL certificates (auto-renewed)
[ ] Review security events
```

---

## 📈 SCALING GUIDELINES

### When to Scale

**Backend (Railway)**:
- CPU usage consistently > 70%
- Response time > 1 second
- Memory usage > 80%
- Database size > 1GB

**Frontend (Vercel)**:
- Bandwidth exceeds free tier (100GB/month)
- Build minutes exceeded

### How to Scale

**Railway**:
1. Upgrade to Hobby plan ($5/month)
2. Add more RAM/CPU to service
3. Separate database to dedicated plan

**Vercel**:
1. Usually stays free
2. If needed, upgrade to Pro ($20/month)

---

**Remember**: Regular monitoring prevents major issues!

**Last Updated**: 2026-01-07

