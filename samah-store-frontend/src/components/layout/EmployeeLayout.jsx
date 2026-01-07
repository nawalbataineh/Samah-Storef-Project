import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployeeLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b border-brand-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-brand-primary">لوحة الموظف</h1>
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
                to="/employee/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                لوحة التحكم
              </Link>
              <Link
                to="/employee/orders"
                className="block px-4 py-2 rounded-lg hover:bg-brand-soft transition text-brand-ink"
              >
                الطلبات المعيّنة لي
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

export default EmployeeLayout;

