import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import SectionTitle from '../components/common/SectionTitle';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ordersApi } from '../services/ordersApi';
import { useToast } from '../context/ToastContext';
import { PackageX, ArrowLeft } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getMyOrders({ page: currentPage, size: 10 });
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      error('فشل في تحميل الطلبات');
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

  if (loading && orders.length === 0) {
    return (
      <Container className="py-8">
        <SectionTitle>طلباتي</SectionTitle>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-8">
        <SectionTitle>طلباتي</SectionTitle>
        <EmptyState
          icon={PackageX}
          title="لا توجد طلبات"
          message="لم تقم بإجراء أي طلبات بعد. ابدأ التسوق الآن!"
          action={
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              <span>تسوق الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <SectionTitle>طلباتي</SectionTitle>

        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card p-6 hover:shadow-xl transition-all block"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">طلب #{order.id}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-gray-600">
                    {order.items?.length || 0} منتج • {order.address?.city || 'عنوان غير محدد'}
                  </p>
                  {order.trackingCode && (
                    <p className="text-sm text-gray-500 mt-1">رمز التتبع: {order.trackingCode}</p>
                  )}
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl font-bold text-brand-primary mb-1">
                    {order.total?.toFixed(2) || '0.00'} JOD
                  </div>
                  <button className="text-brand-primary hover:underline flex items-center gap-1 mr-auto md:mr-0">
                    <span>عرض التفاصيل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;

