import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectToasts, removeToast } from '../../features/ui/uiSlice';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} color="var(--status-success)" />,
    error: <AlertCircle size={18} color="var(--status-error)" />,
    warning: <AlertTriangle size={18} color="var(--status-warning)" />,
    info: <Info size={18} color="var(--status-info)" />,
  };

  return (
    <div
      className="glass-panel toast-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        minWidth: '280px',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface-elevated)',
        animation: 'slideInRight 0.25s ease-out',
      }}
    >
      <div style={{ flexShrink: 0 }}>{icons[toast.type] || icons.info}</div>
      <p style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          borderRadius: '4px',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'auto',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={(id) => dispatch(removeToast(id))}
        />
      ))}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
