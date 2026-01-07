import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b border-brand-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-brand-primary">لوحة الإدارة</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-brand-primary transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-2xl p-6 shadow-sm border border-brand-border h-fit">
            <nav className="space-y-2">
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                لوحة التحكم
              </Link>
              <Link
                to="/admin/orders"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                الطلبات
              </Link>
              <Link
                to="/admin/categories"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                الفئات
              </Link>
              <Link
                to="/admin/products"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                المنتجات
              </Link>
              <Link
                to="/admin/shipping-zones"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                مناطق الشحن
              </Link>
              <Link
                to="/admin/coupons"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                الكوبونات
              </Link>
              <Link
                to="/admin/users"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                المستخدمين
              </Link>
            </nav>
          </aside>

          <main className="flex-1">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

