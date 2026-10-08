/**
 * Formats a numerical value into currency format (e.g. $1,250.00).
 */
export const formatCurrency = (amount, currencyCode = 'USD', locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch (_e) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }
};

/**
 * Formats ISO date string into readable date string.
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric', ...options };
  return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
};
