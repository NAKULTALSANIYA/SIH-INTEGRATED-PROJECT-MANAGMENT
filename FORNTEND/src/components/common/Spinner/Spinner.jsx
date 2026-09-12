import React from 'react';

const Spinner = ({ size = 24, color = 'var(--primary-500)', className = '' }) => {
  return (
    <div
      className={`spinner-loader ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `2.5px solid ${color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spinLoader 0.7s linear infinite',
        }}
      />
      <style>{`
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
