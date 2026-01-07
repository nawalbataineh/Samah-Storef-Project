import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Package, Users, ShoppingCart, DollarSign, Truck, Tag, MapPin, UserCheck, Image, TrendingUp, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, ordersRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.listAllOrders({ size: 5, sort: 'id,desc' })
      ]);

      setMetrics(metricsRes.data);
      setRecentOrders(ordersRes.data.content || []);
    } catch (error) {
      showToast('فشل تحميل بيانات لوحة التحكم', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRevenue = async () => {
    try {
      setResetting(true);
      await adminApi.resetRevenue();

      // Update metrics immediately to show 0.00
      setMetrics(prev => ({
        ...prev,
        revenueSinceReset: 0,
        revenueResetAt: new Date().toISOString()
      }));

      showToast('تم تصفير إجمالي الإيرادات بنجاح', 'success');
      setShowResetModal(false);

      // Refetch to confirm from server
      await loadDashboardData();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تصفير الإيرادات';
      showToast(message, 'error');
    } finally {
      setResetting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusLabel = (status) => {
    const labels = {
      NEW: 'جديد',
      PENDING: 'معلق',
      CONFIRMED: 'مؤكد',
      PROCESSING: 'قيد المعالجة',
      SHIPPED: 'تم الشحن',
      DELIVERED: 'تم التوصيل',
      CANCELLED: 'ملغى'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'bg-slate-50 text-slate-700 border-slate-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
      PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
      DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const KPICard = ({ icon: Icon, label, value, subtext, color = 'text-slate-700', bgColor = 'bg-slate-50' }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${color}`}>
            {loading ? '...' : value}
          </p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">لوحة التحكم</h1>
            <p className="text-sm text-slate-500 mt-1">نظرة عامة على المتجر والطلبات</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={ShoppingCart}
            label="إجمالي الطلبات"
            value={metrics?.totalOrders || 0}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <KPICard
            icon={Clock}
            label="طلبات اليوم"
            value={metrics?.ordersToday || 0}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <KPICard
            icon={DollarSign}
            label="الإيرادات"
            value={`${(Number(metrics?.revenueSinceReset) || 0).toFixed(2)} د.أ`}
            subtext={metrics?.revenueResetAt ? `منذ ${formatDate(metrics.revenueResetAt)}` : 'إجمالي'}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <KPICard
            icon={CheckCircle2}
            label="تم التوصيل"
            value={metrics?.deliveredOrders || 0}
            color="text-teal-600"
            bgColor="bg-teal-50"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">حالة الطلبات</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">قيد المعالجة</p>
                <p className="text-xl font-semibold text-slate-900">{loading ? '...' : metrics?.processingOrders || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-xs text-purple-600 mb-1">تم الشحن</p>
                <p className="text-xl font-semibold text-purple-700">{loading ? '...' : metrics?.shippedOrders || 0}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-xs text-emerald-600 mb-1">تم التوصيل</p>
                <p className="text-xl font-semibold text-emerald-700">{loading ? '...' : metrics?.deliveredOrders || 0}</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
                <p className="text-xs text-rose-600 mb-1">ملغى</p>
                <p className="text-xl font-semibold text-rose-700">{loading ? '...' : metrics?.cancelledOrders || 0}</p>
              </div>
            </div>

            {/* Revenue Reset */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowResetModal(true)}
                disabled={resetting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                تصفير إجمالي الإيرادات
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">آخر الطلبات</h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-sm text-slate-400">جاري التحميل...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-4">لا توجد طلبات</div>
              ) : (
                recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders`}
                    className="block p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-900">#{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{order.customer?.username || 'عميل'}</span>
                      <span className="font-medium text-slate-900">{Number(order.total).toFixed(2)} د.أ</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Link to="/admin/orders" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all group">
              <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-slate-900" strokeWidth={1.5} />
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 text-center">الطلبات</span>
            </Link>
            <Link to="/admin/products" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 transition-all group">
              <Package className="w-5 h-5 text-blue-600 group-hover:text-blue-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-blue-700 group-hover:text-blue-800 text-center">المنتجات</span>
            </Link>
            <Link to="/admin/categories" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-100 hover:border-purple-200 transition-all group">
              <Tag className="w-5 h-5 text-purple-600 group-hover:text-purple-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-purple-700 group-hover:text-purple-800 text-center">الفئات</span>
            </Link>
            <Link to="/admin/users" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-200 transition-all group">
              <UserCheck className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800 text-center">المستخدمين</span>
            </Link>
            <Link to="/admin/shipping-zones" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-100 hover:border-orange-200 transition-all group">
              <MapPin className="w-5 h-5 text-orange-600 group-hover:text-orange-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-orange-700 group-hover:text-orange-800 text-center">مناطق الشحن</span>
            </Link>
            <Link to="/admin/coupons" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-100 hover:border-pink-200 transition-all group">
              <Truck className="w-5 h-5 text-pink-600 group-hover:text-pink-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-pink-700 group-hover:text-pink-800 text-center">الكوبونات</span>
            </Link>
            <Link to="/admin/hero" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 transition-all group">
              <Image className="w-5 h-5 text-rose-600 group-hover:text-rose-700" strokeWidth={1.5} />
              <span className="text-xs font-medium text-rose-700 group-hover:text-rose-800 text-center">الهيرو</span>
            </Link>
          </div>
        </div>

        {/* Revenue Reset Modal */}
        {showResetModal && (
          <Modal
            title="تصفير إجمالي الإيرادات"
            onClose={() => setShowResetModal(false)}
          >
            <div className="space-y-4" dir="rtl">
              <p className="text-sm text-slate-600">
                هل أنت متأكد من تصفير إجمالي الإيرادات؟
              </p>
              <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <strong>ملاحظة:</strong> لن يتم حذف أي طلبات. سيتم فقط تعيين نقطة بداية جديدة لحساب الإيرادات من الآن.
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleResetRevenue}
                  disabled={resetting}
                  variant="primary"
                  className="flex-1"
                >
                  {resetting ? 'جاري التصفير...' : 'تأكيد التصفير'}
                </Button>
                <Button
                  onClick={() => setShowResetModal(false)}
                  disabled={resetting}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


