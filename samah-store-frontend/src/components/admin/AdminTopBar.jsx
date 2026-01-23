import React from 'react';

const HamburgerIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
  </svg>
);

const AdminTopBar = ({ title = 'لوحة الإدارة', onOpenDrawer }) => {
  return (
    <div className="w-full bg-white border-b sticky top-0 z-50 lg:hidden">
      <div className="container-main flex items-center justify-between h-14 px-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            onClick={onOpenDrawer}
            className="p-2 text-charcoal-700 hover:text-berry-500"
          >
            <HamburgerIcon className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* intentionally no auth or logout here; drawer contains logout for mobile */}
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
