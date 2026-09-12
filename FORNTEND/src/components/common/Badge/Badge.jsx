import React from 'react';
import { getStatusBadgeClass } from '../../../utils/formatters';

const Badge = ({ children, variant, status, className = '', ...props }) => {
  let badgeClass = 'badge-primary';
  if (status) {
    badgeClass = getStatusBadgeClass(status);
  } else if (variant) {
    badgeClass = `badge-${variant}`;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`} {...props}>
      {children || status}
    </span>
  );
};

export default Badge;
