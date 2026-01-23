import React from 'react';

export const StatusSelect = ({ order, STATUS_LABELS, updatingId, onUpdateStatus }) => {
  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">تحديث الحالة</label>
      <select
        value={order.status}
        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
        disabled={updatingId === order.id}
        className="text-xs border border-gray-300 rounded px-2 py-1.5 disabled:opacity-50 w-full"
      >
        {Object.keys(STATUS_LABELS).map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  );
};

export const EmployeeSelect = ({ order, employees = [], assigningOrderId, onAssign }) => {
  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">تعيين موظف</label>
      <select
        value={order.assignedEmployee?.id || ''}
        onChange={(e) => onAssign(order.id, e.target.value)}
        disabled={assigningOrderId === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
        className="text-xs border border-gray-300 rounded px-2 py-1.5 w-full disabled:opacity-50 disabled:bg-gray-50"
      >
        <option value="">-- اختر موظف --</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ActionsRow = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={onView}
        className="flex-1 h-10 rounded-lg bg-brand-primary text-white text-sm flex items-center justify-center gap-2"
      >
        عرض
      </button>
      {onEdit && (
        <button type="button" onClick={onEdit} className="flex-1 h-10 rounded-lg bg-white border border-brand-border flex items-center justify-center gap-2 text-sm">
          تحرير
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className="flex-1 h-10 rounded-lg bg-white border border-red-200 text-red-600 flex items-center justify-center gap-2 text-sm">
          حذف
        </button>
      )}
    </div>
  );
};

