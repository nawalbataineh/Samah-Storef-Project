import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart, refreshCart } = useCart();
  const { showToast } = useToast();
  const [updatingVariantId, setUpdatingVariantId] = useState(null);

  // Refresh cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);


  const handleUpdateQuantity = async (variantId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      setUpdatingVariantId(variantId);
      await updateQuantity(variantId, newQty);
    } catch (error) {
      // Error already handled in context
    } finally {
      setUpdatingVariantId(null);
    }
  };

  const handleRemoveItem = async (variantId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج من السلة؟')) return;

    try {
      setUpdatingVariantId(variantId);
      await removeItem(variantId);
      showToast('تم حذف المنتج من السلة', 'success');
    } catch (error) {
      // Error already handled in context
    } finally {
      setUpdatingVariantId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('هل أنت متأكد من تفريغ السلة بالكامل؟')) return;

    try {
      await clearCart();
      showToast('تم تفريغ السلة', 'success');
    } catch (error) {
      // Error already handled in context
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-soft" dir="rtl">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <ShoppingBag className="w-16 h-16 mx-auto text-brand-primary mb-4" />
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض السلة</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل السلة...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  return (
    <div className="min-h-screen py-8 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-brand-ink">سلة التسوق</h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-800 transition"
            >
              تفريغ السلة
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">السلة فارغة</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const variant = item.variant;
                const imageUrl = variant?.product?.images?.[0]?.url;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-brand-border flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={getImageUrl(imageUrl)}
                          alt={variant?.product?.name || 'منتج'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-brand-ink mb-1">
                        {variant?.product?.name || 'منتج'}
                      </h3>
                      <div className="text-sm text-gray-500 space-x-2 space-x-reverse mb-2">
                        {variant?.size && <span>المقاس: {variant.size}</span>}
                        {variant?.color && <span>اللون: {variant.color}</span>}
                      </div>
                      <p className="text-brand-primary font-bold">
                        {(variant?.price || 0).toFixed(2)} د.أ
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemoveItem(variant?.id)}
                        disabled={updatingVariantId === variant?.id}
                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleUpdateQuantity(variant?.id, item.quantity, -1)}
                          disabled={updatingVariantId === variant?.id || item.quantity <= 1}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {updatingVariantId === variant?.id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(variant?.id, item.quantity, 1)}
                          disabled={updatingVariantId === variant?.id}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-gray-700">
                        {(item.lineTotal || (variant?.price || 0) * item.quantity).toFixed(2)} د.أ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-brand-border sticky top-4">
                <h2 className="text-lg font-bold mb-4">ملخص الطلب</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>عدد المنتجات</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} د.أ</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold text-brand-ink">
                    <span>الإجمالي</span>
                    <span>{subtotal.toFixed(2)} د.أ</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-3 bg-brand-primary text-white text-center rounded-xl hover:bg-brand-primaryHover transition font-semibold"
                >
                  إتمام الطلب
                </Link>

                <Link
                  to="/products"
                  className="block w-full py-3 text-center text-brand-primary hover:underline mt-3"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

