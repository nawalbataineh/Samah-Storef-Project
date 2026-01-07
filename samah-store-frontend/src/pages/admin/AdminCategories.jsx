import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ConfirmModal from '../../components/common/ConfirmModal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [permanentDeletingCategory, setPermanentDeletingCategory] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    active: true,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, [page]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listCategories({ page, size: 10 });
      setCategories(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      showToast('فشل تحميل الفئات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', active: true });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      active: category.active,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', active: true });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'الاسم مطلوب';
    if (!formData.slug.trim()) errors.slug = 'الرابط مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData);
        showToast('تم تحديث الفئة بنجاح', 'success');
      } else {
        await adminApi.createCategory(formData);
        showToast('تم إضافة الفئة بنجاح', 'success');
      }
      handleCloseModal();
      loadCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حفظ الفئة';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      await adminApi.deleteCategory(deletingCategory.id);
      showToast('تم حذف الفئة بنجاح', 'success');
      setShowDeleteModal(false);
      setDeletingCategory(null);
      loadCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حذف الفئة';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      setTogglingId(category.id);
      const newActive = !category.active;
      await adminApi.toggleCategoryStatus(category.id, newActive);
      showToast(`تم ${newActive ? 'تفعيل' : 'تعطيل'} الفئة بنجاح`, 'success');
      // Update local state immediately
      setCategories(prev => prev.map(c =>
        c.id === category.id ? { ...c, active: newActive } : c
      ));
    } catch (error) {
      const message = error.response?.data?.message || 'فشل تحديث حالة الفئة';
      showToast(message, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenPermanentDelete = (category) => {
    setPermanentDeletingCategory(category);
    setShowPermanentDeleteModal(true);
  };

  const handleConfirmPermanentDelete = async () => {
    try {
      setSubmitting(true);
      await adminApi.deleteCategoryPermanently(permanentDeletingCategory.id);
      showToast('تم حذف الفئة نهائيًا من قاعدة البيانات', 'success');
      setShowPermanentDeleteModal(false);
      setPermanentDeletingCategory(null);
      // Remove from local state immediately
      setCategories(prev => prev.filter(c => c.id !== permanentDeletingCategory.id));
    } catch (error) {
      const message = error.response?.data?.message || 'فشل الحذف النهائي';
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
          <h1 className="text-2xl font-bold text-brand-ink">إدارة الفئات</h1>
          <Button onClick={handleOpenCreate}>
            إضافة فئة جديدة
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500">لا توجد فئات</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-brand-soft border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">ID</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الرابط (Slug)</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{category.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenEdit(category)}
                            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                            disabled={togglingId === category.id}
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleToggleStatus(category)}
                            className={`text-sm hover:underline disabled:opacity-50 ${
                              category.active ? 'text-orange-600' : 'text-green-600'
                            }`}
                            disabled={togglingId === category.id}
                          >
                            {togglingId === category.id ? 'جاري...' : category.active ? 'تعطيل' : 'تفعيل'}
                          </button>
                          <button
                            onClick={() => handleOpenDelete(category)}
                            className="text-sm text-gray-600 hover:underline disabled:opacity-50"
                            disabled={togglingId === category.id}
                          >
                            حذف
                          </button>
                          <button
                            onClick={() => handleOpenPermanentDelete(category)}
                            className="text-sm text-red-600 hover:underline font-semibold disabled:opacity-50"
                            disabled={togglingId === category.id}
                          >
                            حذف نهائي
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
        title={editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
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
            label="اسم الفئة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            placeholder="مثال: ملابس نسائية"
            disabled={submitting}
          />

          <Input
            label="الرابط (Slug)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            error={formErrors.slug}
            placeholder="مثال: womens-clothing"
            hint="يستخدم في عنوان URL"
            disabled={submitting}
          />

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
              فئة نشطة (تظهر في الموقع)
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
        message={`هل أنت متأكد من حذف الفئة "${deletingCategory?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        isDestructive={true}
        isLoading={submitting}
      />

      {/* Permanent Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showPermanentDeleteModal}
        onClose={() => setShowPermanentDeleteModal(false)}
        onConfirm={handleConfirmPermanentDelete}
        title="⚠️ تحذير: حذف نهائي من قاعدة البيانات"
        message={
          <div className="space-y-2">
            <p className="font-semibold text-red-600">
              هل أنت متأكد من الحذف النهائي للفئة "{permanentDeletingCategory?.name}"؟
            </p>
            <p className="text-sm text-gray-600">
              هذا الإجراء سيحذف الفئة نهائيًا من قاعدة البيانات ولا يمكن التراجع عنه أبدًا.
            </p>
            <p className="text-sm text-red-500 font-medium">
              ملاحظة: لن يتم الحذف إذا كانت هناك منتجات مرتبطة بهذه الفئة.
            </p>
          </div>
        }
        confirmText="نعم، احذف نهائيًا"
        cancelText="إلغاء"
        isDestructive={true}
        isLoading={submitting}
      />
    </AdminLayout>
  );
};

export default AdminCategories;

