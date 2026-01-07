import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import SectionTitle from '../components/common/SectionTitle';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ordersApi } from '../services/ordersApi';
import { useToast } from '../context/ToastContext';
import { ArrowRight, MapPin, Package } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      error('فشل في تحميل تفاصيل الطلب');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PROCESSING: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    const labels = {
      PENDING: 'قيد الانتظار',
      CONFIRMED: 'مؤكد',
      PROCESSING: 'قيد المعالجة',
      SHIPPED: 'تم الشحن',
      DELIVERED: 'تم التوصيل',
      CANCELLED: 'ملغي',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </Container>
    );
  }

  if (!order) return null;

  return (
    <div className="py-8">
      <Container>
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
          <ArrowRight className="w-5 h-5" />
          <span>رجوع للطلبات</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <SectionTitle className="mb-0">طلب #{order.id}</SectionTitle>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-brand-primary" />
                <span>المنتجات</span>
              </h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{item.productName}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.size && `المقاس: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `اللون: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-brand-primary">
                        {item.unitPrice?.toFixed(2)} JOD
                      </div>
                      <div className="text-sm text-gray-600">
                        الإجمالي: {item.lineTotal?.toFixed(2)} JOD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-brand-primary" />
                <span>عنوان التوصيل</span>
              </h3>
              {order.address && (
                <div className="bg-light p-4 rounded-xl">
                  <p className="font-semibold mb-1">{order.address.city}</p>
                  <p className="text-gray-700">{order.address.street}</p>
                  {order.address.details && <p className="text-gray-600 text-sm mt-1">{order.address.details}</p>}
                  <p className="text-gray-600 text-sm mt-2">الهاتف: {order.address.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-6">ملخص الطلب</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-semibold">{order.subtotal?.toFixed(2) || '0.00'} JOD</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>الشحن</span>
                    <span className="font-semibold">{order.shippingFee?.toFixed(2)} JOD</span>
                  </div>
                )}
                {order.discountTotal > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span className="font-semibold">-{order.discountTotal?.toFixed(2)} JOD</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>الإجمالي</span>
                  <span className="text-brand-primary">{order.total?.toFixed(2) || '0.00'} JOD</span>
                </div>
              </div>
              {order.trackingCode && (
                <div className="bg-secondary p-4 rounded-xl">
                  <p className="text-sm font-semibold mb-1">رمز التتبع</p>
                  <p className="text-lg font-mono">{order.trackingCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetailsPage;

