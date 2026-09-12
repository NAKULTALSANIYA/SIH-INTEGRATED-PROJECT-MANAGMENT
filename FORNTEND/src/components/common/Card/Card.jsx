import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  hoverable = false,
  style = {},
  ...props
}) => {
  return (
    <div
      className={`glass-panel card-component ${hoverable ? 'card-hoverable' : ''} ${className}`}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)',
        ...style,
      }}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div style={{ flex: 1 }}>{children}</div>

      {footer && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '12px',
            marginTop: 'auto',
          }}
        >
          {footer}
        </div>
      )}

      <style>{`
        .card-hoverable:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-500);
        }
      `}</style>
    </div>
  );
};

export default Card;
