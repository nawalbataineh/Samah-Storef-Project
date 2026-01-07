import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus, UserCheck, UserX } from 'lucide-react';

const AdminUsers = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Create employee form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      showToast('فشل تحميل قائمة الموظفين', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ username: '', email: '', password: '' });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ username: '', email: '', password: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.length < 3) {
      errors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    }
    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await adminApi.createEmployee(formData);
      showToast('تم إنشاء حساب الموظف بنجاح', 'success');
      handleCloseModal();
      loadEmployees();
    } catch (error) {
      const message = error.response?.data?.message || 'فشل إنشاء حساب الموظف';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentlyEnabled) => {
    const action = currentlyEnabled ? 'تعطيل' : 'تفعيل';
    if (!window.confirm(`هل أنت متأكد من ${action} هذا الموظف؟`)) return;

    try {
      setActionId(userId);
      if (currentlyEnabled) {
        await adminApi.disableUser(userId);
        showToast('تم تعطيل الموظف بنجاح', 'success');
      } else {
        await adminApi.enableUser(userId);
        showToast('تم تفعيل الموظف بنجاح', 'success');
      }
      loadEmployees();
    } catch (error) {
      const message = error.response?.data?.message || `فشل ${action} الموظف`;
      showToast(message, 'error');
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-brand-ink">إدارة الموظفين</h1>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            إضافة موظف
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-brand-primary">{employees.length}</p>
            <p className="text-xs text-gray-500">إجمالي الموظفين</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.enabled).length}</p>
            <p className="text-xs text-gray-500">نشط</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-border text-center">
            <p className="text-2xl font-bold text-red-600">{employees.filter(e => !e.enabled).length}</p>
            <p className="text-xs text-gray-500">معطّل</p>
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-brand-border">
            <p className="text-gray-500 mb-4">لا يوجد موظفين</p>
            <Button onClick={handleOpenCreate}>إضافة أول موظف</Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-brand-soft border-b border-brand-border">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">ID</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">اسم المستخدم</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-ink">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{emp.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{emp.username}</td>
                    <td className="px-6 py-4 text-sm">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.enabled ? 'نشط' : 'معطّل'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(emp.id, emp.enabled)}
                        disabled={actionId === emp.id}
                        className={`flex items-center gap-1 text-sm disabled:opacity-50 ${
                          emp.enabled 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {emp.enabled ? (
                          <>
                            <UserX className="w-4 h-4" />
                            {actionId === emp.id ? 'جاري...' : 'تعطيل'}
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            {actionId === emp.id ? 'جاري...' : 'تفعيل'}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title="إضافة موظف جديد"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              إلغاء
            </Button>
            <Button onClick={handleCreateEmployee} disabled={submitting}>
              {submitting ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <Input
            label="اسم المستخدم"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={formErrors.username}
            placeholder="أدخل اسم المستخدم"
            disabled={submitting}
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            placeholder="example@domain.com"
            disabled={submitting}
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            placeholder="8 أحرف على الأقل"
            disabled={submitting}
          />
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;

