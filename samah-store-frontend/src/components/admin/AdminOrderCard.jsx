import React from 'react';
import { StatusSelect, EmployeeSelect, ActionsRow } from './OrderControls';

const IconView = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconEdit = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 21v-3.75L14.81 5.44a2 2 0 0 1 2.82 0l0.93 0.93a2 2 0 0 1 0 2.82L6.75 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDelete = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdminOrderCard = ({ item, onView, onEdit, onDelete, employees = [], assigningOrderId, updatingId, STATUS_LABELS = {}, onAssign, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-4 mb-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">#{item.id}</div>
          <div className="text-xs text-slate-600 mt-1">العميل: {item.customer?.username || item.customerName || '-'}</div>
        </div>
        <div>
          <div className="text-sm font-semibold">{(item.total || 0).toFixed(2)} د.أ</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mt-3">
        <div>المدينة: {item.address?.city || '-'}</div>
        <div>الحالة: {item.status}</div>
      </div>

      {/* Controls section: reuse desktop controls (status select, employee select, actions) */}
      <div className="mt-4 pt-3 border-t border-brand-border">
        <div className="text-sm font-medium mb-2">إدارة الطلب</div>
        <div className="grid grid-cols-1 gap-3">
          <StatusSelect order={item} STATUS_LABELS={STATUS_LABELS} updatingId={updatingId} onUpdateStatus={onUpdateStatus} />
          <EmployeeSelect order={item} employees={employees} assigningOrderId={assigningOrderId} onAssign={onAssign} />
          <ActionsRow onView={() => onView && onView(item)} onEdit={() => onEdit && onEdit(item)} onDelete={() => onDelete && onDelete(item)} />
        </div>
      </div>

      {/* Existing quick action buttons (kept for backward compatibility) */}
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => onView && onView(item)}
          className="flex-1 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center gap-2"
        >
          <IconView />
          <span>عرض</span>
        </button>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit && onEdit(item)}
            className="flex-1 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center gap-2"
          >
            <IconEdit />
            <span>تحرير</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete && onDelete(item)}
            className="flex-1 h-12 rounded-xl bg-white border border-red-200 text-red-600 flex items-center justify-center gap-2"
          >
            <IconDelete />
            <span>حذف</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminOrderCard;

