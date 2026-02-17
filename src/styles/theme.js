/**
 * Design System Theme
 * Light mode only – Mint & Coral Medical UI
 *
 * Rules:
 * - Do NOT hardcode colors or spacing in UI files
 * - Use named spacing tokens (xs–3xl) for UI
 * - Use numeric spacing only for layout math
 * - Backend SSOT does not affect styling logic
 */

export const colors = {
  /**
   * PRIMARY – Mint Teal
   */
  primary: {
    50: '#E6FAF6',
    100: '#CFF5EC',
    200: '#A3EADF',
    300: '#76DFD1',
    400: '#55CBB4',
    500: '#55CBB4', // canonical mint
    600: '#3FB8A1',
    700: '#2E9C87',
    800: '#1F7A6A',
    900: '#145A4F',
  },

  /**
   * SECONDARY – Coral
   */
  secondary: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#FF7072', // canonical coral
    600: '#E85558',
    700: '#BE3A3D',
    800: '#9F2F32',
    900: '#7F1D1D',
  },

  /**
   * SUCCESS – Medical Green
   */
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  /**
   * WARNING – Warm Yellow
   */
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FFD972',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  /**
   * DANGER – Medical Red
   */
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  /**
   * GRAYS – Neutral UI foundation
   */
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  /**
   * SURFACES – App layers
   */
  surface: {
    app: '#F9FAFB',        // main app background
    card: '#FCFFFE',       // cards / sections
    elevated: '#FFFFFF',  // modals, sheets
  },

  /**
   * TEXT – High readability (WCAG-friendly)
   */
  text: {
    primary: '#23344D',
    secondary: '#6B7280',
    muted: '#8A94A6', // improved contrast
    inverse: '#FFFFFF',
  },

  /**
   * BASE
   */
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  transparent: 'transparent',
};

/**
 * Typography
 * Use fontSizes + fontWeights only (single source of truth)
 */
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

   lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Spacing
 * - Named keys → UI components
 * - Numeric keys → layout math only
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,

  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

/**
 * Border Radius
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

/**
 * Borders (NEW)
 */
export const borders = {
  subtle: '#E5E7EB',
  strong: '#D1D5DB',
  focus: colors.primary[500],
};

/**
 * Status Text Colors (NEW)
 */
export const statusText = {
  success: colors.success[700],
  warning: colors.warning[700],
  danger: colors.danger[700],
};

/**
 * Shadows – restrained for medical UI
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
};

/**
 * Unified Theme Export
 */
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  borders,
  statusText,
  shadows,
};

export default theme;
