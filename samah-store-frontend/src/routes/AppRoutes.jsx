import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';

// Public pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FAQPage from '../pages/FAQPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';

// Customer pages
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminShippingZones from '../pages/admin/AdminShippingZones';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminHeroSettings from '../pages/admin/AdminHeroSettings';

// Employee pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeOrders from '../pages/employee/EmployeeOrders';
import EmployeeOrderDetails from '../pages/employee/EmployeeOrderDetails';

// 403 Page
import ForbiddenPage from '../pages/ForbiddenPage';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  // Redirect authenticated users from home/login based on role
  const getDefaultRoute = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'EMPLOYEE') return '/employee/dashboard';
    return '/';
  };

  const defaultRoute = getDefaultRoute();

  return (
    <Routes>
      {/* Public routes with Header/Footer */}
      <Route element={<PublicLayout />}>
        {/* Redirect authenticated admin/employee from public pages */}
        <Route
          path="/"
          element={defaultRoute && (user.role === 'ADMIN' || user.role === 'EMPLOYEE') ? <Navigate to={defaultRoute} replace /> : <HomePage />}
        />
        <Route
          path="/login"
          element={defaultRoute ? <Navigate to={defaultRoute} replace /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public pages */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailsPage />} />

        {/* Static pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Customer routes (protected but still show header/footer) */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />

        {/* Error pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin routes (no public header/footer) */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/shipping-zones" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShippingZones /></ProtectedRoute>} />
      <Route path="/admin/coupons" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCoupons /></ProtectedRoute>} />
      <Route path="/admin/hero" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminHeroSettings /></ProtectedRoute>} />

      {/* Employee routes (no public header/footer) */}
      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/orders" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeOrders /></ProtectedRoute>} />
      <Route path="/employee/orders/:id" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeOrderDetails /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;

