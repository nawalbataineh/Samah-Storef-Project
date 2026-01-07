import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeApi } from '../../services/employeeApi';
import { useToast } from '../../context/ToastContext';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import { Package, Clock, CheckCircle2, ListTodo, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({ assigned: 0, processing: 0, shipped: 0, shippedToday: 0 });
  const [myOrders, setMyOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueAt: '',
    relatedOrderId: null
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [ordersRes, tasksRes] = await Promise.all([
        employeeApi.listOrders({ size: 100 }),
        employeeApi.listTasks({ size: 20, sort: 'createdAt,desc' })
      ]);

      const orders = ordersRes.data.content || [];
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      setStats({
        assigned: orders.length,
        processing: orders.filter(o => o.status === 'PROCESSING').length,
        shipped: orders.filter(o => o.status === 'SHIPPED').length,
        shippedToday: orders.filter(o => o.status === 'SHIPPED' && new Date(o.updatedAt) >= todayStart).length
      });

      setMyOrders(orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).slice(0, 5));
      setTasks(tasksRes.data.content || []);
    } catch (error) {
      showToast('فشل تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      showToast('يرجى إدخال عنوان المهمة', 'error');
      return;
    }

    try {
      await employeeApi.createTask({
        ...taskForm,
        dueAt: taskForm.dueAt ? new Date(taskForm.dueAt).toISOString() : null
      });
      showToast('تم إضافة المهمة بنجاح', 'success');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueAt: '', relatedOrderId: null });
      loadDashboard();
    } catch (error) {
      showToast('فشل إضافة المهمة', 'error');
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    const task = tasks.find(t => t.id === taskId);

    try {
      await employeeApi.updateTask(taskId, { ...task, status: nextStatus });
      loadDashboard();
    } catch (error) {
      showToast('فشل تحديث المهمة', 'error');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      NEW: 'جديد', PENDING: 'معلق', CONFIRMED: 'مؤكد', PROCESSING: 'قيد المعالجة',
      SHIPPED: 'تم الشحن', DELIVERED: 'تم التوصيل', CANCELLED: 'ملغى'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'bg-slate-50 text-slate-700 border-slate-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
      PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
      DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'bg-slate-100 text-slate-600',
      MEDIUM: 'bg-amber-100 text-amber-700',
      HIGH: 'bg-rose-100 text-rose-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-600';
  };

  const getTaskStatusIcon = (status) => {
    return status === 'DONE' ? '✓' : status === 'IN_PROGRESS' ? '⋯' : '○';
  };

  const KPICard = ({ icon: Icon, label, value, color = 'text-slate-700', bgColor = 'bg-slate-50' }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          <p className={`text-xl font-semibold ${color}`}>{loading ? '...' : value}</p>
        </div>
        <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );

  return (
    <EmployeeLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">لوحة الموظف</h1>
          <p className="text-sm text-slate-500 mt-1">مهامي وطلباتي</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={Package} label="المعيّنة لي" value={stats.assigned} color="text-indigo-600" bgColor="bg-indigo-50" />
          <KPICard icon={Clock} label="قيد المعالجة" value={stats.processing} color="text-blue-600" bgColor="bg-blue-50" />
          <KPICard icon={CheckCircle2} label="تم الشحن" value={stats.shipped} color="text-purple-600" bgColor="bg-purple-50" />
          <KPICard icon={CheckCircle2} label="شُحنت اليوم" value={stats.shippedToday} color="text-emerald-600" bgColor="bg-emerald-50" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">مهامي اليوم</h2>
              <Button size="sm" onClick={() => setShowTaskModal(true)}>
                <Plus className="w-4 h-4 ml-1" /> مهمة
              </Button>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="text-sm text-slate-400">جاري التحميل...</div>
              ) : tasks.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-4">لا توجد مهام</div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id, task.status)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold
                        ${task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' : 
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {getTaskStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      {task.relatedOrderId && (
                        <Link to={`/employee/orders/${task.relatedOrderId}`} className="text-xs text-blue-600 hover:underline">
                          طلب #{task.relatedOrderId}
                        </Link>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'HIGH' ? 'عالي' : task.priority === 'MEDIUM' ? 'متوسط' : 'منخفض'}
                    </span>
                  </div>
                ))
              )}
            </div>
            {tasks.length > 5 && (
              <Link to="/employee/tasks" className="block text-center text-sm text-slate-600 hover:text-slate-900 mt-3">
                عرض جميع المهام ←
              </Link>
            )}
          </div>

          {/* My Orders */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">طلبات معيّنة لي</h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-sm text-slate-400">جاري التحميل...</div>
              ) : myOrders.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-4">لا توجد طلبات</div>
              ) : (
                myOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/employee/orders/${order.id}`}
                    className="block p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-900">#{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{order.customer?.username || 'عميل'}</span>
                      <span className="font-medium text-slate-900">{Number(order.total).toFixed(2)} د.أ</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {myOrders.length > 0 && (
              <Link to="/employee/orders" className="block text-center text-sm text-slate-600 hover:text-slate-900 mt-3">
                عرض جميع الطلبات ←
              </Link>
            )}
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <Modal title="إضافة مهمة جديدة" onClose={() => setShowTaskModal(false)}>
            <div className="space-y-4" dir="rtl">
              <Input
                label="عنوان المهمة"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="مثال: متابعة طلب #123"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الوصف (اختياري)</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="تفاصيل المهمة..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الأولوية</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="LOW">منخفض</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">عالي</option>
                </select>
              </div>
              <Input
                type="datetime-local"
                label="تاريخ الاستحقاق (اختياري)"
                value={taskForm.dueAt}
                onChange={(e) => setTaskForm({ ...taskForm, dueAt: e.target.value })}
              />
              <Input
                type="number"
                label="رقم الطلب المرتبط (اختياري)"
                value={taskForm.relatedOrderId || ''}
                onChange={(e) => setTaskForm({ ...taskForm, relatedOrderId: e.target.value ? Number(e.target.value) : null })}
                placeholder="مثال: 42"
              />
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateTask} className="flex-1">إضافة المهمة</Button>
                <Button variant="outline" onClick={() => setShowTaskModal(false)} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;

