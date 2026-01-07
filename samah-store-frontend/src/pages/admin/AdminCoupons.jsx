import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingCoupon, setDeletingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    value: '',
    minOrderTotal: '',
    startAt: '',
    endAt: '',
    usageLimitTotal: '',
    usageLimitPerUser: '',
    active: true,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCoupons();
  }, [page]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listCoupons({ page, size: 10 });
      setCoupons(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      showToast('فشل تحميل الكوبونات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'PERCENT',
      value: '',
      minOrderTotal: '',
      startAt: '',
      endAt: '',
      usageLimitTotal: '',
      usageLimitPerUser: '',
      active: true,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrderTotal: coupon.minOrderTotal ? coupon.minOrderTotal.toString() : '',
      startAt: coupon.startAt ? coupon.startAt.substring(0, 16) : '',
      endAt: coupon.endAt ? coupon.endAt.substring(0, 16) : '',
      usageLimitTotal: coupon.usageLimitTotal ? coupon.usageLimitTotal.toString() : '',
      usageLimitPerUser: coupon.usageLimitPerUser ? coupon.usageLimitPerUser.toString() : '',
      active: coupon.active,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'PERCENT',
      value: '',
      minOrderTotal: '',
      startAt: '',
      endAt: '',
      usageLimitTotal: '',
      usageLimitPerUser: '',
      active: true,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) {
      errors.code = 'كود الكوبون مطلوب';
    }
    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      errors.value = 'القيمة يجب أن تكون رقم موجب';
    }
    if (formData.type === 'PERCENT' && parseFloat(formData.value) > 100) {
      errors.value = 'نسبة الخصم يجب أن تكون بين 0 و 100';
    }
    if (formData.minOrderTotal && (isNaN(formData.minOrderTotal) || parseFloat(formData.minOrderTotal) < 0)) {
      errors.minOrderTotal = 'يجب أن تكون رقم موجب أو فارغ';
    }
    if (formData.usageLimitTotal && (isNaN(formData.usageLimitTotal) || parseInt(formData.usageLimitTotal) < 1)) {
      errors.usageLimitTotal = 'يجب أن يكون رقم صحيح موجب أو فارغ';
    }
    if (formData.usageLimitPerUser && (isNaN(formData.usageLimitPerUser) || parseInt(formData.usageLimitPerUser) < 1)) {
      errors.usageLimitPerUser = 'يجب أن يكون رقم صحيح موجب أو فارغ';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        minOrderTotal: formData.minOrderTotal ? parseFloat(formData.minOrderTotal) : null,
        startAt: formData.startAt ? new Date(formData.startAt).toISOString() : null,
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
        usageLimitTotal: formData.usageLimitTotal ? parseInt(formData.usageLimitTotal) : null,
        usageLimitPerUser: formData.usageLimitPerUser ? parseInt(formData.usageLimitPerUser) : null,
        active: formData.active,
      };

      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, payload);
        showToast('تم تحديث الكوبون بنجاح', 'success');
      } else {
        await adminApi.createCoupon(payload);
        showToast('تم إضافة الكوبون بنجاح', 'success');
      }
      handleCloseModal();
      loadCoupons();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حفظ الكوبون';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (coupon) => {
    setDeletingCoupon(coupon);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await adminApi.deleteCoupon(deletingCoupon.id);
      showToast('تم حذف الكوبون بنجاح', 'success');
      setShowDeleteModal(false);
      setDeletingCoupon(null);
      loadCoupons();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حذف الكوبون';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && page === 0) {
    return (
      <AdminLayout>
        <div className="text-center py-12">جاري التحميل...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-ink">الكوبونات</h1>
          <Button onClick={handleOpenCreate}>
            إضافة كوبون جديد
          </Button>
        </div>

        {coupons.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500">لا توجد كوبونات</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-soft border-b border-brand-border">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الكود</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">النوع</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">القيمة</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الحد الأدنى</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الصلاحية</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-bold text-berry-600">{coupon.code}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.type === 'PERCENT' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {coupon.type === 'PERCENT' ? 'نسبة مئوية' : 'خصم ثابت'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-berry-500">
                          {coupon.type === 'PERCENT' ? `${coupon.value}%` : `${coupon.value} دينار`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {coupon.minOrderTotal ? `${coupon.minOrderTotal} دينار` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="text-xs">
                            <div>{formatDate(coupon.startAt)}</div>
                            {coupon.endAt && <div className="text-gray-500">إلى {formatDate(coupon.endAt)}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {coupon.active ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(coupon)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleOpenDelete(coupon)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  size="small"
                >
                  السابق
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  صفحة {page + 1} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  size="small"
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="كود الكوبون"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            error={formErrors.code}
            placeholder="مثال: SAVE10"
            hint="سيتم تحويله لأحرف كبيرة تلقائياً"
            disabled={submitting}
          />

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              نوع الخصم
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={submitting}
              className="w-full px-4 py-3 bg-white border border-charcoal-200 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 disabled:opacity-50"
            >
              <option value="PERCENT">نسبة مئوية (%)</option>
              <option value="FIXED">خصم ثابت (دينار)</option>
            </select>
          </div>

          <Input
            label="القيمة"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            error={formErrors.value}
            placeholder={formData.type === 'PERCENT' ? 'مثال: 10' : 'مثال: 5.00'}
            hint={formData.type === 'PERCENT' ? 'نسبة الخصم (0-100)' : 'مبلغ الخصم بالدينار'}
            disabled={submitting}
          />

          <Input
            label="الحد الأدنى للطلب (اختياري)"
            type="number"
            step="0.01"
            min="0"
            value={formData.minOrderTotal}
            onChange={(e) => setFormData({ ...formData, minOrderTotal: e.target.value })}
            error={formErrors.minOrderTotal}
            placeholder="مثال: 50.00"
            hint="الحد الأدنى لإجمالي الطلب لتطبيق الكوبون"
            disabled={submitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاريخ البداية (اختياري)"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              disabled={submitting}
            />

            <Input
              label="تاريخ الانتهاء (اختياري)"
              type="datetime-local"
              value={formData.endAt}
              onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="حد الاستخدام الكلي (اختياري)"
              type="number"
              min="1"
              value={formData.usageLimitTotal}
              onChange={(e) => setFormData({ ...formData, usageLimitTotal: e.target.value })}
              error={formErrors.usageLimitTotal}
              placeholder="مثال: 100"
              hint="عدد مرات الاستخدام الإجمالي"
              disabled={submitting}
            />

            <Input
              label="حد الاستخدام لكل مستخدم (اختياري)"
              type="number"
              min="1"
              value={formData.usageLimitPerUser}
              onChange={(e) => setFormData({ ...formData, usageLimitPerUser: e.target.value })}
              error={formErrors.usageLimitPerUser}
              placeholder="مثال: 1"
              hint="عدد مرات الاستخدام لكل عميل"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-berry-500 rounded focus:ring-2 focus:ring-rose-100"
              disabled={submitting}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              كوبون نشط (يمكن استخدامه)
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الكوبون "${deletingCoupon?.code}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isDestructive={true}
        isLoading={submitting}
      />
    </AdminLayout>
  );
};

export default AdminCoupons;

