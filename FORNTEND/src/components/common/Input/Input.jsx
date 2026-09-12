import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      rightElement,
      className = '',
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {Icon && (
            <div
              style={{
                position: 'absolute',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              <Icon size={16} />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: `1px solid ${error ? 'var(--status-error)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              paddingLeft: Icon ? '38px' : '14px',
              paddingRight: rightElement ? '40px' : '14px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.borderColor = 'var(--border-color-focus)';
                e.target.style.backgroundColor = 'var(--bg-input-focus)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.backgroundColor = 'var(--bg-input)';
              }
            }}
            className={`input-field ${className}`}
            {...props}
          />

          {rightElement && (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--status-error)' }}>{error}</span>
        ) : helperText ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
