# متجر سماح - Samah Store Frontend

Beautiful Arabic RTL-ready React e-commerce storefront with cool-pink premium theme.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Navigate to frontend directory
cd samah-store-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── main.jsx                 # Entry point with RTL setup
├── App.jsx                  # Main app with providers
├── routes/
│   ├── AppRoutes.jsx       # All routes definition
│   └── ProtectedRoute.jsx  # Auth guard component
├── pages/                   # All page components
├── components/
│   ├── layout/             # Header, Footer, Container
│   ├── ui/                 # Reusable UI components
│   ├── products/           # Product-specific components
│   └── common/             # Shared components
├── context/                # React contexts (Auth, Toast, Cart)
├── services/               # API integration layer
└── styles/
    └── index.css          # Global styles + Tailwind
```

## 🎨 Design System

### Colors
- **Primary**: `#D7A6B8` (Cool pink)
- **Secondary**: `#F2DCE5` (Light pink)
- **Accent**: `#B8869F` (Dark pink)
- **Dark**: `#2B2B2B`
- **Light**: `#FFF7FA`
- **Cream**: `#FEF9F5`

### Typography
- Font: Cairo (Arabic-optimized)
- Weights: 300, 400, 600, 700, 800

## 🔐 Authentication Flow

1. User registers/logs in → receives `accessToken` in JSON
2. Token stored in `localStorage` with key `"token"`
3. Refresh token stored in HttpOnly cookie automatically
4. Axios interceptor attaches token to requests
5. On 401 error → auto-refresh → retry request
6. If refresh fails → redirect to login

## 📦 API Integration

### Base URL
Set in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

### Key Endpoints Used
- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Products**: `/api/products`, `/api/products/{slug}`, `/api/categories`
- **Cart**: `/api/cart`, `/api/cart/items`
- **Orders**: `/api/orders`, `/api/orders/me`
- **Addresses**: `/api/addresses`

See backend contract in code comments for full details.

## 🛠️ Remaining Files to Implement

You have the infrastructure ready. Now create these page/component files following the existing patterns:

### Pages (src/pages/)
All pages should import and use:
- `Container` for layout
- `SectionTitle` for headings
- `Skeleton` for loading states
- `EmptyState` for empty data
- `useToast` for notifications

**HomePage.jsx** - Hero + categories + new products
**ProductsPage.jsx** - Filters + grid + pagination
**ProductDetailsPage.jsx** - Images + variants + add to cart
**CartPage.jsx** - Cart items table + update/remove
**CheckoutPage.jsx** - Address selection + place order
**OrdersPage.jsx** - Orders list with pagination
**OrderDetailsPage.jsx** - Single order details
**LoginPage.jsx** - Login form
**RegisterPage.jsx** - Register form
**AboutPage.jsx** - Static about content
**ContactPage.jsx** - Contact form
**FAQPage.jsx** - Accordion FAQs
**PrivacyPolicyPage.jsx** - Static privacy policy
**TermsPage.jsx** - Static terms
**NotFoundPage.jsx** - 404 page

### Product Components (src/components/products/)

**ProductCard.jsx**
```jsx
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const imageUrl = product.primaryImageUrl || '/placeholder.jpg';
  const price = product.minVariantPrice || 0;
  
  return (
    <Link to={`/products/${product.slug}`} className="card group">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{price} JOD</span>
          <button className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};
```

**FiltersSidebar.jsx** - Category + price range filters
**VariantPicker.jsx** - Size/color selection buttons
**QuantitySelector.jsx** - +/- buttons for quantity

### Example LoginPage.jsx

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Container from '../components/layout/Container';

const LoginPage = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.usernameOrEmail, formData.password);
      success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (err) {
      error('فشل تسجيل الدخول. تحقق من بياناتك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-3xl font-bold text-center mb-8">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني أو اسم المستخدم"
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري التسجيل...' : 'دخول'}
          </Button>
        </form>
        <p className="text-center mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-primary font-semibold">
            سجل الآن
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
```

## 🎯 Implementation Checklist

- [x] Project setup with Vite + Tailwind
- [x] API client with interceptors
- [x] Auth, Toast, Cart contexts
- [x] Routing setup
- [x] Header & Footer layout
- [x] UI components (Button, Input, Modal, etc.)
- [ ] **All page components** (follow patterns above)
- [ ] **Product components** (ProductCard, FiltersSidebar, etc.)
- [ ] Test authentication flow
- [ ] Test cart operations
- [ ] Test checkout process

## 🐛 Troubleshooting

### CORS Errors
Ensure backend has CORS configured for `http://localhost:5173`

### 401 Errors
Check that token is stored in localStorage and backend JWT is valid

### Images not loading
Images from API are relative paths - add fallback:
```jsx
const imageUrl = product.primaryImageUrl 
  ? `${import.meta.env.VITE_API_BASE_URL}${product.primaryImageUrl}`
  : '/placeholder.jpg';
```

## 📝 Notes

- All text is in Arabic for RTL experience
- Prices displayed in JOD (Jordanian Dinar)
- Cart uses `variantId` not `productId`
- Pagination is 0-indexed on backend
- Use skeleton loaders during data fetching
- Show empty states when no data

## 🚢 Deployment

```bash
npm run build
# Deploy 'dist' folder to any static host (Vercel, Netlify, etc.)
```

Update `.env` with production API URL before building.

---

**Need Help?** Check existing component patterns and follow the same structure.

