import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminShippingZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [deletingZone, setDeletingZone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    city: '',
    shippingFee: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadZones();
  }, [page]);

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listShippingZones({ page, size: 10 });
      setZones(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      showToast('فشل تحميل مناطق الشحن', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingZone(null);
    setFormData({ city: '', shippingFee: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      city: zone.city,
      shippingFee: zone.shippingFee?.toString() || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({ city: '', shippingFee: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.city.trim()) errors.city = 'المدينة مطلوبة';
    if (!formData.shippingFee || isNaN(formData.shippingFee) || parseFloat(formData.shippingFee) < 0) {
      errors.shippingFee = 'رسوم الشحن يجب أن تكون رقم موجب';
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
        city: formData.city.trim(),
        shippingFee: parseFloat(formData.shippingFee),
      };

      if (editingZone) {
        await adminApi.updateShippingZone(editingZone.id, payload);
        showToast('تم تحديث منطقة الشحن بنجاح', 'success');
      } else {
        await adminApi.createShippingZone(payload);
        showToast('تم إضافة منطقة الشحن بنجاح', 'success');
      }
      handleCloseModal();
      await loadZones();
    } catch (error) {
      // Handle 409 conflict (duplicate city)
      if (error.response?.status === 409) {
        showToast('هذه المدينة موجودة بالفعل', 'error');
      } else {
        const message = error.response?.data?.message || 'فشل حفظ منطقة الشحن';
        showToast(message, 'error');
      }
      // Keep modal open on error so user can fix
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (zone) => {
    setDeletingZone(zone);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await adminApi.deleteShippingZone(deletingZone.id);
      showToast('تم حذف منطقة الشحن بنجاح', 'success');
      setShowDeleteModal(false);
      setDeletingZone(null);
      await loadZones();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حذف منطقة الشحن';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-brand-ink">مناطق الشحن</h1>
          <Button onClick={handleOpenCreate}>
            إضافة منطقة شحن
          </Button>
        </div>

        {zones.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500">لا توجد مناطق شحن</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-brand-soft border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">ID</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">المدينة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">رسوم الشحن (JOD)</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {zones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{zone.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{zone.city}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-semibold text-brand-primary">{(zone.shippingFee || 0).toFixed(2)}</span> دينار
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(zone)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleOpenDelete(zone)}
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

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  السابق
                </Button>
                <span className="px-4 py-2">صفحة {page + 1} من {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
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
        title={editingZone ? 'تعديل منطقة شحن' : 'إضافة منطقة شحن'}
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
            label="المدينة"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={formErrors.city}
            placeholder="مثال: عمّان"
            disabled={submitting}
          />
          <Input
            label="رسوم الشحن (دينار)"
            type="number"
            step="0.01"
            min="0"
            value={formData.shippingFee}
            onChange={(e) => setFormData({ ...formData, shippingFee: e.target.value })}
            error={formErrors.shippingFee}
            placeholder="مثال: 3.50"
            disabled={submitting}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingZone(null);
        }}
        onConfirm={handleConfirmDelete}
        title="حذف منطقة شحن"
        message={`هل أنت متأكد من حذف منطقة "${deletingZone?.city}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        loading={submitting}
        variant="danger"
      />
    </AdminLayout>
  );
};

export default AdminShippingZones;

