import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminTopBar from '../../components/admin/AdminTopBar';
import SidebarDrawer from '../../components/admin/SidebarDrawer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile TopBar */}
      <AdminTopBar title="لوحة الإدارة" onOpenDrawer={openDrawer} />

      <header className="bg-white shadow-sm border-b border-brand-border hidden lg:block">
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

      <SidebarDrawer open={drawerOpen} onClose={closeDrawer} fromRight={true}>
        <div className="p-4">
          <AdminSidebar onNavigate={closeDrawer} />
        </div>
      </SidebarDrawer>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 bg-white rounded-2xl p-6 shadow-sm border border-brand-border h-fit">
            <AdminSidebar />
          </aside>

          <main className="flex-1 pb-20">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
