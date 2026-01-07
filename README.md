# 🛍️ Samah Store - E-Commerce Platform

Premium e-commerce system for girls/women fashion store built with Spring Boot + React.

**Status**: ✅ Production Ready | ✅ Deployment Package Included

---

## 🚀 DEPLOYMENT (NEW!)

### Ready to Deploy to Production?
👉 **Start here**: [`DEPLOYMENT_INDEX.md`](DEPLOYMENT_INDEX.md)

**Quick Path**:
1. Read: [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) (2-3 hours)
2. Deploy to: Railway + Vercel + Cloudflare
3. Cost: ~$10/month
4. Domain: Your custom .tech domain + HTTPS

**What's Included**:
- ✅ Docker container (`Dockerfile`)
- ✅ Railway config (`railway.json`)
- ✅ Vercel config (`vercel.json`)
- ✅ Production settings (`application-prod.yaml`)
- ✅ 4 comprehensive deployment guides
- ✅ Monitoring & maintenance guides

**Documentation**:
- [`DEPLOYMENT_SUMMARY.md`](DEPLOYMENT_SUMMARY.md) - Overview
- [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) - Quick start ⭐
- [`DEPLOYMENT_GUIDE_COMPLETE.md`](DEPLOYMENT_GUIDE_COMPLETE.md) - Detailed guide
- [`MONITORING_GUIDE.md`](MONITORING_GUIDE.md) - Post-deployment

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### 1. Database Setup
```sql
CREATE DATABASE samah_store;
```

### 2. Start Backend
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\samah.storef\samah.store-Project
.\mvnw.cmd spring-boot:run
```

### 3. Start Frontend
```powershell
cd samah-store-frontend
npm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **API Docs**: See `API_REFERENCE_COMPLETE.md`

---

## 👤 Default Users

Create these users for testing:

### Admin
```sql
INSERT INTO store.users (username, email, password_hash, role, enabled) 
VALUES ('admin', 'admin@samahstore.com', '$2a$10$...', 'ADMIN', true);
```
**Login**: admin / admin123

### Customer
**Register via**: http://localhost:5173/register

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `PROJECT_STATUS_REPORT.md` | Complete project overview |
| `API_REFERENCE_COMPLETE.md` | All API endpoints |
| `FRONTEND_INTEGRATION_TEST.md` | 10-minute test guide |
| `BACKEND_AUDIT_COMPLETE.md` | Backend test results |

---

## 🧪 Testing

### Backend API Tests
```powershell
.\api-test.ps1
```

### Frontend Manual Tests
See: `FRONTEND_INTEGRATION_TEST.md`

---

## 🚀 Build for Production

### Backend
```powershell
.\mvnw.cmd clean package -DskipTests
# Output: target/hotel-reservation-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd samah-store-frontend
npm run build
# Output: dist/ folder
```

---

## 📊 Features

### Customer
- Browse products with filters
- Product details with variants
- Shopping cart
- Checkout with address management
- Order history
- Coupon support

### Admin
- Dashboard with metrics
- Product management (CRUD)
- Category management
- Order management with status updates
- Employee assignment
- Shipping zones
- Coupon management
- Revenue tracking

### Employee
- View assigned orders
- Update order status
- Process deliveries

---

## 🔐 Security

- JWT authentication (access + refresh tokens)
- Role-based access control (CUSTOMER, EMPLOYEE, ADMIN)
- Password hashing (BCrypt)
- HttpOnly cookies for refresh tokens
- CORS configured

---

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway (optional)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Context API

---

## 📝 License

Proprietary - Samah Store

---

## 🎯 Status

✅ **Production Ready**

- All critical bugs fixed
- Full integration tested
- Documentation complete
- Build passing

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-05

