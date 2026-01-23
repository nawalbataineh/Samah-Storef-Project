import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const AdminCard = ({ item, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-4 mb-3 block lg:hidden">
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

      <div className="flex gap-2 mt-3">
        <button onClick={() => onView && onView(item)} className="flex-1 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          عرض
        </button>
        <button onClick={() => onEdit && onEdit(item)} className="flex-1 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center gap-2">
          <Edit className="w-4 h-4" />
          تحرير
        </button>
        <button onClick={() => onDelete && onDelete(item)} className="flex-1 h-12 rounded-xl bg-white border border-red-200 text-red-600 flex items-center justify-center gap-2">
          <Trash className="w-4 h-4" />
          حذف
        </button>
      </div>
    </div>
  );
};

export default AdminCard;
