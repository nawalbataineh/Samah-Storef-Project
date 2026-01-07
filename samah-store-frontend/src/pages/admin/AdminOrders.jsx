import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { Filter, Eye, Copy, Phone, Mail, MapPin } from 'lucide-react';

const STATUS_LABELS = {
  NEW: 'جديد',
  PROCESSING: 'قيد المعالجة',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  FAILED_PICKUP: 'تعذر الاستلام'
};

const FILTER_OPTIONS = [
  { value: '', label: 'الكل' },
  { value: 'UNASSIGNED', label: 'غير معيّنة' },
  { value: 'ASSIGNED', label: 'معيّنة' },
  { value: 'NEW', label: 'جديد' },
  { value: 'PROCESSING', label: 'قيد المعالجة' },
  { value: 'SHIPPED', label: 'تم الشحن' },
  { value: 'DELIVERED', label: 'تم التوصيل' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveredTab, setDeliveredTab] = useState(false); // false = active, true = delivered
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { showToast } = useToast();

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`تم نسخ ${label}`, 'success');
    }).catch(() => {
      showToast('فشل النسخ', 'error');
    });
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [page, deliveredTab]);

  useEffect(() => {
    // Apply filter
    if (!statusFilter) {
      setFilteredOrders(orders);
    } else if (statusFilter === 'UNASSIGNED') {
      setFilteredOrders(orders.filter(o => !o.assignedEmployee));
    } else if (statusFilter === 'ASSIGNED') {
      setFilteredOrders(orders.filter(o => o.assignedEmployee));
    } else {
      setFilteredOrders(orders.filter(o => o.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const loadEmployees = async () => {
    try {
      const response = await adminApi.listEmployees();
      // Only show active employees
      setEmployees((response.data || []).filter(e => e.enabled));
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { page, size: 100, sort: 'id,desc' };
      // Add delivered filter based on active tab
      params.delivered = deliveredTab;

      const response = await adminApi.listAllOrders(params);
      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      showToast('فشل تحميل الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignEmployee = async (orderId, employeeId) => {
    if (!employeeId) return;

    try {
      setAssigningOrderId(orderId);
      await adminApi.assignOrder(orderId, parseInt(employeeId));
      showToast('تم تعيين الطلب للموظف بنجاح', 'success');
      await loadOrders(); // Refresh immediately
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تعيين الطلب';
      showToast(message, 'error');
    } finally {
      setAssigningOrderId(null);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`هل أنت متأكد من تحديث الحالة إلى ${STATUS_LABELS[newStatus]}؟`)) return;

    try {
      setUpdatingId(orderId);
      await adminApi.updateOrderStatus(orderId, newStatus);
      showToast('تم تحديث حالة الطلب بنجاح', 'success');

      // Optimistic update: remove order from list if FAILED_PICKUP or DELIVERED (when on active tab)
      if (newStatus === 'FAILED_PICKUP' || (newStatus === 'DELIVERED' && !deliveredTab)) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setFilteredOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        // For other status changes, refresh to get updated data
        await loadOrders();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تحديث حالة الطلب';
      showToast(message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'NEW').length,
    unassigned: orders.filter(o => !o.assignedEmployee && ['NEW', 'PROCESSING', 'SHIPPED'].includes(o.status)).length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="text-center py-12">جاري التحميل...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-brand-ink">إدارة الطلبات</h1>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              {FILTER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active/Delivered Tabs */}
        <div className="flex gap-2 border-b border-brand-border">
          <button
            onClick={() => {
              setDeliveredTab(false);
              setPage(0);
              setStatusFilter('');
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              !deliveredTab
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-gray-600 hover:text-brand-primary'
            }`}
          >
            الطلبات النشطة
            {!deliveredTab && (
              <span className="absolute top-1 left-1 w-2 h-2 bg-brand-primary rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => {
              setDeliveredTab(true);
              setPage(0);
              setStatusFilter('');
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              deliveredTab
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            الطلبات المُسلّمة
            {deliveredTab && (
              <span className="absolute top-1 left-1 w-2 h-2 bg-green-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button
            onClick={() => setStatusFilter('')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === '' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-brand-border hover:border-brand-primary'
            }`}
          >
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs">الكل</p>
          </button>
          <button
            onClick={() => setStatusFilter('UNASSIGNED')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === 'UNASSIGNED' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-brand-border hover:border-orange-500'
            }`}
          >
            <p className="text-xl font-bold">{stats.unassigned}</p>
            <p className="text-xs">غير معيّنة</p>
          </button>
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === 'NEW' ? 'bg-gray-500 text-white border-gray-500' : 'bg-white border-brand-border hover:border-gray-500'
            }`}
          >
            <p className="text-xl font-bold">{stats.new}</p>
            <p className="text-xs">جديد</p>
          </button>
          <button
            onClick={() => setStatusFilter('PROCESSING')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === 'PROCESSING' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-brand-border hover:border-blue-500'
            }`}
          >
            <p className="text-xl font-bold">{stats.processing}</p>
            <p className="text-xs">قيد المعالجة</p>
          </button>
          <button
            onClick={() => setStatusFilter('SHIPPED')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === 'SHIPPED' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white border-brand-border hover:border-purple-500'
            }`}
          >
            <p className="text-xl font-bold">{stats.shipped}</p>
            <p className="text-xs">تم الشحن</p>
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`p-3 rounded-xl border text-center transition ${
              statusFilter === 'DELIVERED' ? 'bg-green-500 text-white border-green-500' : 'bg-white border-brand-border hover:border-green-500'
            }`}
          >
            <p className="text-xl font-bold">{stats.delivered}</p>
            <p className="text-xs">تم التوصيل</p>
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500">
              {statusFilter ? `لا توجد طلبات ${FILTER_OPTIONS.find(o => o.value === statusFilter)?.label || ''}` : 'لا توجد طلبات'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-soft border-b border-brand-border">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">رقم الطلب</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">الحالة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">الإجمالي</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">المدينة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">تعيين موظف</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">تحديث الحالة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-ink">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium">#{order.id}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">{order.total?.toFixed(2)} د.أ</td>
                      <td className="px-4 py-4 text-sm">{order.address?.city || '-'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <select
                            value={order.assignedEmployee?.id || ''}
                            onChange={(e) => handleAssignEmployee(order.id, e.target.value)}
                            disabled={assigningOrderId === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                            className="text-xs border border-gray-300 rounded px-2 py-1.5 w-32 disabled:opacity-50 disabled:bg-gray-50"
                          >
                            <option value="">-- اختر موظف --</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>
                                {emp.username}
                              </option>
                            ))}
                          </select>
                          {order.assignedEmployee && (
                            <span className="text-xs text-green-600">
                              ✓ {order.assignedEmployee.username}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="text-xs border border-gray-300 rounded px-2 py-1.5 disabled:opacity-50"
                        >
                          {Object.keys(STATUS_LABELS).map(status => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => openDetails(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-white text-xs rounded-lg hover:bg-brand-primaryHover transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          تفاصيل
                        </button>
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title={`تفاصيل الطلب #${selectedOrder.id}`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  selectedOrder.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                  selectedOrder.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {STATUS_LABELS[selectedOrder.status]}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-brand-soft p-4 rounded-xl">
                <h3 className="font-semibold text-brand-ink mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  معلومات العميل
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedOrder.customer?.username}</span>
                      <button
                        onClick={() => copyToClipboard(selectedOrder.customer?.username, 'اسم العميل')}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-brand-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">البريد الإلكتروني:</span>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${selectedOrder.customer?.email}`} className="font-medium text-brand-primary hover:underline">
                        {selectedOrder.customer?.email}
                      </a>
                      <button
                        onClick={() => copyToClipboard(selectedOrder.customer?.email, 'البريد الإلكتروني')}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-brand-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-brand-soft p-4 rounded-xl">
                <h3 className="font-semibold text-brand-ink mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  عنوان التوصيل
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الهاتف:</span>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${selectedOrder.address?.phone}`} className="font-medium text-brand-primary hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedOrder.address?.phone}
                      </a>
                      <button
                        onClick={() => copyToClipboard(selectedOrder.address?.phone, 'رقم الهاتف')}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-brand-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600">العنوان:</span>
                    <div className="flex items-start gap-2 text-left max-w-xs">
                      <div className="font-medium text-right">
                        <div>{selectedOrder.address?.city}</div>
                        <div>{selectedOrder.address?.street}</div>
                        {selectedOrder.address?.details && <div className="text-gray-600 text-xs mt-1">{selectedOrder.address.details}</div>}
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${selectedOrder.address?.city}, ${selectedOrder.address?.street}${selectedOrder.address?.details ? ', ' + selectedOrder.address.details : ''}`, 'العنوان')}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-brand-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-brand-ink mb-3">المنتجات</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-brand-border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.size && `مقاس: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `لون: ${item.color}`}
                        </p>
                        {item.variantSku && <p className="text-xs text-gray-400">SKU: {item.variantSku}</p>}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{item.lineTotal?.toFixed(2)} د.أ</p>
                        <p className="text-xs text-gray-500">{item.quantity} × {item.unitPrice?.toFixed(2)} د.أ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-brand-soft p-4 rounded-xl space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{selectedOrder.subtotal?.toFixed(2)} د.أ</span>
                </div>
                {selectedOrder.discountTotal > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>الخصم:</span>
                    <span className="font-medium">- {selectedOrder.discountTotal?.toFixed(2)} د.أ</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">رسوم الشحن:</span>
                  <span className="font-medium">{selectedOrder.shippingFee?.toFixed(2)} د.أ</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                  <span className="font-bold text-brand-ink">الإجمالي:</span>
                  <span className="font-bold text-brand-primary text-lg">{selectedOrder.total?.toFixed(2)} د.أ</span>
                </div>
              </div>

              {/* Assigned Employee */}
              {selectedOrder.assignedEmployee && (
                <div className="bg-blue-50 p-4 rounded-xl text-sm">
                  <span className="text-gray-600">معيّن إلى: </span>
                  <span className="font-medium">{selectedOrder.assignedEmployee.username}</span>
                  <span className="text-gray-500 mr-2">({selectedOrder.assignedEmployee.email})</span>
                </div>
              )}

              {/* Tracking Code */}
              {selectedOrder.trackingCode && (
                <div className="bg-purple-50 p-4 rounded-xl text-sm flex items-center justify-between">
                  <span className="text-gray-600">كود التتبع: <span className="font-mono font-medium">{selectedOrder.trackingCode}</span></span>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.trackingCode, 'كود التتبع')}
                    className="p-1 hover:bg-white rounded transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-brand-primary" />
                  </button>
                </div>
              )}

              {/* Created Date */}
              {selectedOrder.createdAt && (
                <div className="text-xs text-gray-500 text-center">
                  تاريخ الإنشاء: {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

