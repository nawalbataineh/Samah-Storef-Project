import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { employeeApi } from '../../services/employeeApi';
import { useToast } from '../../context/ToastContext';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import { Filter } from 'lucide-react';

const STATUS_LABELS = {
  NEW: 'جديد',
  PENDING: 'معلق',
  CONFIRMED: 'مؤكد',
  PROCESSING: 'قيد المعالجة',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغى'
};

const STATUS_OPTIONS = [
  { value: '', label: 'جميع الحالات' },
  { value: 'PROCESSING', label: 'قيد المعالجة' },
  { value: 'SHIPPED', label: 'تم الشحن' },
  { value: 'DELIVERED', label: 'تم التوصيل' },
];

const EmployeeOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [page]);

  useEffect(() => {
    // Filter orders based on status
    if (statusFilter) {
      setFilteredOrders(orders.filter(o => o.status === statusFilter));
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.listOrders({ page, size: 100, sort: 'id,desc' });
      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      showToast('فشل تحميل الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    if (value) {
      searchParams.set('status', value);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`هل أنت متأكد من تحديث الحالة إلى ${STATUS_LABELS[newStatus]}؟`)) return;

    try {
      setUpdatingId(orderId);
      await employeeApi.updateOrderStatus(orderId, newStatus);
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
      loadOrders();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تحديث حالة الطلب';
      showToast(message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'PROCESSING') return 'SHIPPED';
    if (currentStatus === 'SHIPPED') return 'DELIVERED';
    return null;
  };

  const canUpdateStatus = (status) => {
    return status === 'PROCESSING' || status === 'SHIPPED';
  };

  if (loading && orders.length === 0) {
    return (
      <EmployeeLayout>
        <div className="text-center py-12">جاري التحميل...</div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-brand-ink">الطلبات المعيّنة لي</h1>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-brand-primary">{orders.length}</p>
            <p className="text-xs text-gray-500">إجمالي</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'PROCESSING').length}</p>
            <p className="text-xs text-gray-500">قيد المعالجة</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'SHIPPED').length}</p>
            <p className="text-xs text-gray-500">تم الشحن</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'DELIVERED').length}</p>
            <p className="text-xs text-gray-500">تم التوصيل</p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500">
              {statusFilter ? `لا توجد طلبات بحالة "${STATUS_LABELS[statusFilter]}"` : 'لا توجد طلبات معيّنة لك حاليًا'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-brand-soft border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">رقم الطلب</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الإجمالي</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">المدينة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{order.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{order.total?.toFixed(2)} د.أ</td>
                      <td className="px-6 py-4 text-sm">{order.address?.city || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/employee/orders/${order.id}`}
                            className="text-sm text-brand-primary hover:underline"
                          >
                            عرض
                          </Link>
                          {canUpdateStatus(order.status) && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                              disabled={updatingId === order.id}
                              className="text-sm text-green-600 hover:underline disabled:opacity-50"
                            >
                              {updatingId === order.id ? '...' : `→ ${STATUS_LABELS[getNextStatus(order.status)]}`}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white border border-brand-border rounded-lg disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="px-4 py-2">صفحة {page + 1} من {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-white border border-brand-border rounded-lg disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeOrders;

