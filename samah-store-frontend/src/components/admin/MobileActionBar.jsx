import React from 'react';

const MobileActionBar = ({ actions = [] }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 lg:hidden">
      {actions.map((a, idx) => (
        <button key={idx} onClick={a.onClick} className="flex-1 h-12 rounded-xl bg-berry-500 text-white flex items-center justify-center gap-2">
          {a.icon && <span className="inline-block">{a.icon}</span>}
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileActionBar;
