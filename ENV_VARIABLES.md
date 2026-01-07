# Deployment Environment Variables

## Backend (Railway)

```env
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=<Railway will provide this>

# JWT Configuration
JWT_SECRET=<Generate using: openssl rand -base64 64>

# Server Port (Railway will set this)
PORT=8080

# File Upload
UPLOAD_DIR=/tmp/uploads
UPLOAD_BASE_URL=/uploads

# CORS (Update with your actual domains)
CORS_ALLOWED_ORIGINS=https://samahstore.tech,https://www.samahstore.tech
```

## Frontend (Vercel)

```env
# API Base URL
VITE_API_BASE_URL=https://api.samahstore.tech
```

---

## How to Generate JWT Secret

### Option 1: OpenSSL (Recommended)
```bash
openssl rand -base64 64
```

### Option 2: Online Generator
Visit: https://generate-secret.vercel.app/64

### Option 3: Node.js
```javascript
require('crypto').randomBytes(64).toString('base64')
```

---

## Example Complete Environment

### Railway Backend (.env)
```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://postgres:password@db.railway.internal:5432/railway
JWT_SECRET=7X9kL2mP5qR8sT1vW4yZ6aC3dF0gH9jK2lN5pQ8rS1tU4wX7zA0bC3eF6hI9kL2mP5qR8sT1vW4yZ6aC3dF0gH9jK2lN5pQ8rS1tU4wX7zA0bC3eF6hI9kL2m
PORT=8080
UPLOAD_DIR=/tmp/uploads
UPLOAD_BASE_URL=/uploads
CORS_ALLOWED_ORIGINS=https://samahstore.tech,https://www.samahstore.tech,http://localhost:5173
```

### Vercel Frontend
```env
VITE_API_BASE_URL=https://api.samahstore.tech
```

---

## Security Notes

1. **Never commit secrets to Git**
2. **Use different JWT secrets for dev/staging/prod**
3. **Rotate secrets periodically (every 90 days)**
4. **Keep DATABASE_URL secure**
5. **Update CORS_ALLOWED_ORIGINS after domain setup**

---

## Verification

After setting environment variables:

1. **Backend**: Check Railway logs for startup confirmation
2. **Frontend**: Test API calls in browser console
3. **CORS**: Verify no CORS errors in browser DevTools

---

**Last Updated**: 2026-01-07

