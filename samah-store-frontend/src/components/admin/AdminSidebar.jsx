import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ onNavigate }) => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <nav className="space-y-2">
        <Link
          to="/admin/dashboard"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          لوحة التحكم
        </Link>
        <Link
          to="/admin/orders"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          الطلبات
        </Link>
        <Link
          to="/admin/categories"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          الفئات
        </Link>
        <Link
          to="/admin/products"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          المنتجات
        </Link>
        <Link
          to="/admin/shipping-zones"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          مناطق الشحن
        </Link>
        <Link
          to="/admin/coupons"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          الكوبونات
        </Link>
        <Link
          to="/admin/users"
          onClick={onNavigate}
          className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
        >
          المستخدمين
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-brand-border">
        <button
          onClick={logout}
          className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:text-brand-primary"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
