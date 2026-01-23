import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CloseIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SidebarDrawer = ({ open, onClose, children, fromRight = true }) => {
  const location = useLocation();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Close drawer when route changes (safety) and restore body scroll
  useEffect(() => {
    if (open) {
      // when route changes while drawer open, close it
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // prevent body scroll when drawer is open
    const original = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [open]);

  // Render but control visibility/interaction via classes so we get an actual slide animation
  return (
    <>
      {/* Backdrop: visible/clickable only when open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Panel: translate on X axis. When closed, move fully out of view; when open translate-x-0 */}
      <aside
        className={`fixed inset-y-0 ${fromRight ? 'right-0' : 'left-0'} z-50 w-72 max-w-xs bg-white border-l border-slate-100 lg:hidden transform transition-transform duration-300 ${open ? 'translate-x-0 pointer-events-auto' : (fromRight ? 'translate-x-full pointer-events-none' : '-translate-x-full pointer-events-none')}`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">قائمة</div>
            <button onClick={onClose} aria-label="Close navigation" className="px-2 py-1 text-sm">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {children}
          </div>

        </div>
      </aside>
    </>
  );
};

export default SidebarDrawer;
