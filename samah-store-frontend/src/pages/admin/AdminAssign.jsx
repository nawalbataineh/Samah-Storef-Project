/**
 * SAMAH STORE - Admin Assign (Arabic)
 * تعيين طلبات للموظفين
 * ❌ الباك إند غير جاهز - UI جاهز للربط
 */

import { useState } from 'react';
import { UserPlus, AlertTriangle, Package, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminAssign = () => {
  const [orderId, setOrderId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // هذه الميزة غير متاحة حالياً
  const isBackendReady = false;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!isBackendReady) {
      alert('هذه الميزة غير متاحة حالياً. الباك إند غير جاهز.');
      return;
    }
    // عند جاهزية الباك إند:
    // await adminApi.assignOrderToEmployee(orderId, employeeId);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Backend Not Ready Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">غير متاح حالياً</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                هذه الميزة تتطلب endpoints جديدة في الباك إند لم يتم تنفيذها بعد.
                الواجهة جاهزة للربط عند اكتمال الباك إند.
              </p>
              <div className="mt-3 text-xs text-amber-600 font-mono bg-amber-100 px-3 py-2 rounded">
                <div>GET /api/admin/employees</div>
                <div>PATCH /api/admin/orders/{'{id}'}/assign</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-charcoal-200 p-8 shadow-sm opacity-60">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-berry-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-charcoal-800">تعيين طلب لموظف</h1>
              <p className="text-sm text-charcoal-500">
                اختر الطلب والموظف لتعيين المسؤولية
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAssign} className="space-y-6">
            {/* Order Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                <Package className="w-4 h-4" />
                <span>رقم الطلب</span>
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="أدخل رقم الطلب"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:border-berry-400 transition-colors text-right"
                disabled={!isBackendReady}
              />
            </div>

            {/* Employee Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                <Users className="w-4 h-4" />
                <span>رقم الموظف</span>
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="أدخل رقم الموظف"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:outline-none focus:border-berry-400 transition-colors text-right"
                disabled={!isBackendReady}
              />
              <p className="text-xs text-charcoal-400 mt-2">
                * عند جاهزية الباك إند، ستظهر قائمة منسدلة بالموظفين
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isBackendReady}
              className="w-full px-6 py-3 bg-berry-500 hover:bg-berry-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>تعيين</span>
            </button>
          </form>
        </div>

        {/* Required Backend Info */}
        <div className="mt-6 bg-charcoal-50 rounded-xl p-6 border border-charcoal-200">
          <h3 className="font-medium text-charcoal-700 mb-3">الـ Endpoints المطلوبة:</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">1.</span>
              <div>
                <code className="bg-charcoal-200 px-2 py-0.5 rounded text-xs">GET /api/admin/employees</code>
                <p className="text-charcoal-500 mt-1">جلب قائمة الموظفين للاختيار منها</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">2.</span>
              <div>
                <code className="bg-charcoal-200 px-2 py-0.5 rounded text-xs">PATCH /api/admin/orders/{'{id}'}/assign</code>
                <p className="text-charcoal-500 mt-1">تعيين طلب لموظف معيّن</p>
                <p className="text-charcoal-400 text-xs mt-1">Body: {`{ "employeeId": number }`}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAssign;
