/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param value - The numeric value to format
 * @param currencyCode - The currency code (default: 'ARS')
 * @param options - Additional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currencyCode: string = 'ARS',
  options: Intl.NumberFormatOptions = {}
): string => {
  // Handle null/undefined/NaN values
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return formatter.format(value);
};

/**
 * Format a date to a specified format
 * @param date - Date to format (Date object or ISO string)
 * @param format - Format string ('short', 'medium', 'long', 'full', or custom)
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
    case 'medium':
      options.day = '2-digit';
      options.month = 'short';
      options.year = 'numeric';
      break;
    case 'long':
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'full':
      options.weekday = 'long';
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
      break;
  }
  
  return new Intl.DateTimeFormat('es-AR', options).format(dateObj);
};

/**
 * Get the month name from a date
 * @param date - Date to extract month from (Date object or ISO string)
 * @returns Month name in Spanish
 */
export const getMonthName = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(dateObj);
};

/**
 * Format a number with commas for thousands
 * @param value - Number to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  decimalPlaces: number = 2
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a percentage
 * @param value - Number to format as percentage (0.45 = 45%)
 * @param decimalPlaces - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimalPlaces: number = 1
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Get current month and year as a formatted string
 * @returns Current month and year (e.g., "Mayo 2023")
 */
export const getCurrentMonthYear = (): string => {
  const now = new Date();
  return new Intl.DateTimeFormat('es-AR', { 
    month: 'long',
    year: 'numeric'
  }).format(now);
};
