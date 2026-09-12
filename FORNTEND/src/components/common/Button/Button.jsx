import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '0.8125rem' },
    md: { padding: '9px 18px', fontSize: '0.875rem' },
    lg: { padding: '12px 24px', fontSize: '1rem' },
  }[size] || { padding: '9px 18px', fontSize: '0.875rem' };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary-600)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
    },
    secondary: {
      backgroundColor: 'var(--bg-hover)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-500)',
      border: '1px solid var(--primary-500)',
    },
    danger: {
      backgroundColor: 'var(--status-error)',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    },
  }[variant] || {};

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{ ...baseStyles, ...sizeStyles, ...variantStyles }}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.06);
        }
        .btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
};

export default Button;
