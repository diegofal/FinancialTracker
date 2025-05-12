/**
 * Theme constants for the application
 * Defines colors, font sizes, spacing, etc.
 */

export const colors = {
  primary: '#007AFF',
  secondary: '#F2F2F7',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#D1D1D6',
  background: '#F2F2F7',
  card: '#FFFFFF',
  
  // App specific colors
  debt: '#FF3B30',       // Red for debt
  credit: '#007AFF',     // Blue for credit
  neutral: '#8E8E93',    // Gray for neutral values
  highlight: '#000000',  // Black for highlighted text
  
  // Status colors for stock
  stockNeedsReposition: '#FF3B30',
  stockOk: '#34C759',
  stockOptimal: '#007AFF',
  stockLow: '#FF9500',
};

export const typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
