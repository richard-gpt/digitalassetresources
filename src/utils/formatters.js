/**
 * Format a number as USD currency
 */
export function formatCurrency(value, minimumFractionDigits = 2) {
  if (value === null || value === undefined) return '$0.00';

  // For very small values, show more decimals
  if (Math.abs(value) < 0.01 && value !== 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value);
  }

  // For large values, show fewer decimals
  if (Math.abs(value) >= 1000) {
    minimumFractionDigits = 0;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a percentage with + or - sign
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return '0.00%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format large numbers with abbreviations (K, M, B, T)
 */
export function formatCompactNumber(value) {
  if (value === null || value === undefined) return '0';

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

/**
 * Format a quantity (crypto amount)
 */
export function formatQuantity(value) {
  if (value === null || value === undefined) return '0';

  // For very small amounts, show more precision
  if (Math.abs(value) < 0.0001 && value !== 0) {
    return value.toFixed(8);
  }

  if (Math.abs(value) < 1) {
    return value.toFixed(6);
  }

  if (Math.abs(value) < 1000) {
    return value.toFixed(4);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a date for chart display
 */
export function formatChartDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
