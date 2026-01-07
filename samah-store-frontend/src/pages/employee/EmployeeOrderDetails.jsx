import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { employeeApi } from '../../services/employeeApi';
import { useToast } from '../../context/ToastContext';
import EmployeeLayout from '../../components/layout/EmployeeLayout';

const STATUS_LABELS = {
  NEW: 'جديد',
  PENDING: 'معلق',
  CONFIRMED: 'مؤكد',
  PROCESSING: 'قيد المعالجة',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغى'
};

const EmployeeOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        showToast('لا يمكنك الوصول إلى هذا الطلب', 'error');
      } else {
        showToast('فشل تحميل تفاصيل الطلب', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`هل أنت متأكد من تحديث الحالة إلى ${STATUS_LABELS[newStatus]}؟`)) return;

    try {
      setUpdating(true);
      await employeeApi.updateOrderStatus(id, newStatus);
      showToast('تم تحديث حالة الطلب بنجاح', 'success');
      loadOrder();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تحديث حالة الطلب';
      showToast(message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="text-center py-12">جاري التحميل...</div>
      </EmployeeLayout>
    );
  }

  if (!order) {
    return (
      <EmployeeLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">الطلب غير موجود أو لا يمكنك الوصول إليه</p>
          <Link to="/employee/orders" className="text-brand-primary hover:underline">
            العودة للطلبات
          </Link>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-ink">تفاصيل الطلب #{order.id}</h1>
          <Link to="/employee/orders" className="text-brand-primary hover:underline">
            ← العودة للطلبات
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h2 className="text-lg font-semibold mb-4">معلومات الطلب</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">الحالة:</span>
                <p className="font-medium">{STATUS_LABELS[order.status]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">الإجمالي:</span>
                <p className="font-medium">{order.total?.toFixed(2)} د.أ</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">الإجمالي الفرعي:</span>
                <p className="font-medium">{order.subtotal?.toFixed(2)} د.أ</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">رسوم الشحن:</span>
                <p className="font-medium">{order.shippingFee?.toFixed(2)} د.أ</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h2 className="text-lg font-semibold mb-4">عنوان التوصيل</h2>
            <div className="space-y-2">
              <p><strong>المدينة:</strong> {order.address?.city}</p>
              <p><strong>الشارع:</strong> {order.address?.street}</p>
              <p><strong>التفاصيل:</strong> {order.address?.details}</p>
              <p><strong>الهاتف:</strong> {order.address?.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
          <h2 className="text-lg font-semibold mb-4">تحديث الحالة</h2>
          <div className="flex gap-4">
            {order.status === 'PROCESSING' && (
              <button
                onClick={() => handleStatusUpdate('SHIPPED')}
                disabled={updating}
                className="px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition disabled:opacity-50"
              >
                {updating ? 'جاري التحديث...' : 'تحديث إلى: تم الشحن'}
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                onClick={() => handleStatusUpdate('DELIVERED')}
                disabled={updating}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
              >
                {updating ? 'جاري التحديث...' : 'تحديث إلى: تم التوصيل'}
              </button>
            )}
            {!['PROCESSING', 'SHIPPED'].includes(order.status) && (
              <p className="text-gray-500">لا يمكن تحديث الحالة في الوقت الحالي</p>
            )}
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h2 className="text-lg font-semibold mb-4">المنتجات</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.size && `المقاس: ${item.size}`}
                      {item.color && ` | اللون: ${item.color}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.lineTotal?.toFixed(2)} د.أ</p>
                    <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeOrderDetails;

