/**
 * Official Indian Public Sector Formatters
 */

export const formatCrores = (amountInCrores) => {
  if (amountInCrores === undefined || amountInCrores === null) return '₹0 Cr';
  const num = Number(amountInCrores);
  if (isNaN(num)) return '₹0 Cr';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
    case 'mitigated':
    case 'closed':
      return 'badge-completed';
    case 'active':
    case 'in-progress':
    case 'in progress':
      return 'badge-inprogress';
    case 'delayed':
    case 'critical':
    case 'cancelled':
    case 'blocked':
      return 'badge-delayed';
    case 'on-hold':
    case 'review':
    case 'high':
      return 'badge-approved';
    case 'planning':
    case 'pending':
    case 'todo':
    case 'open':
    case 'low':
    case 'medium':
    default:
      return 'badge-planning';
  }
};

export const getInitials = (name = '') => {
  if (!name) return 'GOV';
  const cleaned = name.replace(/^(Shri|Dr\.|Prof\.|Smt\.|Er\.)\s+/i, '');
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
