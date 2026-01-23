import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { addressesApi } from '../services/addressesApi';
import { shippingApi } from '../services/shippingApi';
import { couponApi } from '../services/couponApi';
import { ordersApi } from '../services/ordersApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    city: '',
    street: '',
    details: '',
    phone: '',
  });
  const [addressFormErrors, setAddressFormErrors] = useState({});

  // Shipping
  const [shippingQuote, setShippingQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Order
  const [placingOrder, setPlacingOrder] = useState(false);

  // Derived values
  const subtotal = cart?.subtotal || 0;
  const shippingFee = shippingQuote?.fee || 0;
  const discount = appliedCoupon?.discount ? Number(appliedCoupon.discount) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    // Fetch shipping quote when address or subtotal changes
    if (selectedAddressId && subtotal > 0) {
      fetchShippingQuote();
    }
  }, [selectedAddressId, subtotal]);

  const loadAddresses = async () => {
    try {
      const data = await addressesApi.getAddresses();
      setAddresses(data || []);
      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const fetchShippingQuote = async () => {
    if (!selectedAddressId) return;

    try {
      setLoadingShipping(true);
      const quote = await shippingApi.getShippingQuote(selectedAddressId, subtotal);
      setShippingQuote(quote);
    } catch (error) {
      showToast('فشل تحميل رسوم الشحن', 'error');
      setShippingQuote(null);
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('الرجاء إدخال كود الكوبون');
      return;
    }

    try {
      setLoadingCoupon(true);
      setCouponError('');
      const result = await couponApi.applyCoupon(couponCode.toUpperCase(), subtotal);
      setAppliedCoupon(result);
      showToast('تم تطبيق الكوبون بنجاح', 'success');
    } catch (error) {
      const message = error.response?.data?.message || 'كوبون غير صالح';
      setCouponError(message);
      showToast(message, 'error');
      setAppliedCoupon(null);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleOpenAddressModal = () => {
    setAddressFormData({ city: '', street: '', details: '', phone: '' });
    setAddressFormErrors({});
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setAddressFormData({ city: '', street: '', details: '', phone: '' });
    setAddressFormErrors({});
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!addressFormData.city.trim()) errors.city = 'المدينة مطلوبة';
    if (!addressFormData.street.trim()) errors.street = 'الشارع مطلوب';
    if (!addressFormData.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';
    // New: only digits, length 6-15
    else if (!/^[0-9]{6,15}$/.test(addressFormData.phone)) errors.phone = 'رقم الهاتف غير صالح';
    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    try {
      const newAddress = await addressesApi.createAddress(addressFormData);
      showToast('تم إضافة العنوان بنجاح', 'success');
      handleCloseAddressModal();
      await loadAddresses();
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      showToast('فشل إضافة العنوان', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!cart || cart.items?.length === 0) {
      showToast('السلة فارغة', 'error');
      return;
    }

    if (!selectedAddressId) {
      showToast('الرجاء اختيار عنوان التوصيل', 'error');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        addressId: selectedAddressId,
        couponCode: appliedCoupon?.code || null,
      };

      const order = await ordersApi.placeOrder(orderData);
      showToast('تم إنشاء الطلب بنجاح', 'success');
      await refreshCart(); // Clear cart after successful order
      navigate(`/orders/${order.id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'فشل إنشاء الطلب';
      showToast(message, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لإتمام الطلب</p>
          <Link to="/login" className="text-brand-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen py-12" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500 mb-4">السلة فارغة</p>
            <Link to="/products">
              <Button>تصفح المنتجات</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-brand-ink">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
              <h2 className="text-lg font-semibold mb-4 text-brand-ink">المنتجات ({cart.items.length})</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.variant?.productName || 'منتج'}</h3>
                      <p className="text-xs text-gray-500">
                        {item.variant?.size && `مقاس: ${item.variant.size}`}
                        {item.variant?.size && item.variant?.color && ' • '}
                        {item.variant?.color && `لون: ${item.variant.color}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-berry-500">{(item.lineTotal || (item.variant?.price || 0) * (item.quantity || 0)).toFixed(2)} دينار</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-brand-ink">عنوان التوصيل</h2>
                <Button size="small" variant="outline" onClick={handleOpenAddressModal}>
                  إضافة عنوان
                </Button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-gray-500 text-sm">لا توجد عناوين. الرجاء إضافة عنوان أولاً.</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                        selectedAddressId === address.id
                          ? 'border-berry-500 bg-rose-50'
                          : 'border-gray-200 hover:border-berry-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{address.city} - {address.street}</p>
                        {address.details && <p className="text-xs text-gray-500">{address.details}</p>}
                        <p className="text-xs text-gray-500 mt-1">📞 {address.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Shipping Quote */}
              {selectedAddressId && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {loadingShipping ? (
                    <p className="text-sm text-gray-500">جاري حساب رسوم الشحن...</p>
                  ) : shippingQuote ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">رسوم الشحن إلى {shippingQuote.city}</p>
                        {shippingQuote.zone && <p className="text-xs text-gray-500">{shippingQuote.zone}</p>}
                      </div>
                      <p className="font-semibold text-berry-500">{(shippingQuote.fee || 0).toFixed(2)} دينار</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">لا يمكن حساب رسوم الشحن لهذا العنوان</p>
                  )}
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
              <h2 className="text-lg font-semibold mb-4 text-brand-ink">كود الخصم</h2>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                    <p className="text-sm text-green-600">
                      خصم: {appliedCoupon.type === 'PERCENT' ? `${appliedCoupon.value}%` : `${appliedCoupon.value} دينار`}
                      {' - '}
                      {(appliedCoupon.discount || 0).toFixed(2)} دينار
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-600 hover:underline"
                  >
                    إزالة
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="أدخل كود الخصم"
                      error={couponError}
                      disabled={loadingCoupon}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={loadingCoupon || !couponCode.trim()}
                      variant="outline"
                    >
                      {loadingCoupon ? 'جاري التحقق...' : 'تطبيق'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-brand-ink">ملخص الطلب</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{subtotal.toFixed(2)} دينار</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">الخصم ({appliedCoupon.code})</span>
                    <span className="font-medium text-green-600">-{discount.toFixed(2)} دينار</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">رسوم الشحن</span>
                  <span className="font-medium">
                    {loadingShipping ? '...' : shippingFee > 0 ? `${shippingFee.toFixed(2)} دينار` : 'اختر عنوان'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-brand-ink">الإجمالي</span>
                <span className="text-2xl font-bold text-berry-500">{total.toFixed(2)} دينار</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddressId || loadingShipping || cart.items.length === 0}
                className="w-full"
              >
                {placingOrder ? 'جاري إنشاء الطلب...' : 'إتمام الطلب'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                بالنقر على "إتمام الطلب" فإنك توافق على شروط الخدمة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={handleCloseAddressModal}
        title="إضافة عنوان جديد"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCloseAddressModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmitAddress}>
              حفظ
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitAddress} className="space-y-4">
          <Input
            label="المدينة"
            value={addressFormData.city}
            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
            error={addressFormErrors.city}
            placeholder="مثال: عمّان"
          />

          <Input
            label="الشارع"
            value={addressFormData.street}
            onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
            error={addressFormErrors.street}
            placeholder="مثال: شارع الجامعة"
          />

          <Input
            label="تفاصيل إضافية (اختياري)"
            value={addressFormData.details}
            onChange={(e) => setAddressFormData({ ...addressFormData, details: e.target.value })}
            placeholder="مثال: بناية رقم 5، الطابق الثاني"
          />

          <Input
            label="رقم الهاتف"
            value={addressFormData.phone}
            onChange={(e) => {
              // allow digits only
              const digitsOnly = e.target.value.replace(/\D/g, '');
              // enforce max length on input
              setAddressFormData({ ...addressFormData, phone: digitsOnly.slice(0, 15) });
            }}
            error={addressFormErrors.phone}
            placeholder="رقم الهاتف"
            type="tel"
          />
        </form>
      </Modal>
    </div>
  );
};

export default CheckoutPage;

