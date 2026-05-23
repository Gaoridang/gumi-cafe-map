/**
 * Design Tokens for Gumi Cafe Map — authoritative (from ui-designer)
 * 8pt rhythm + warm cafe neutrals. Use these everywhere.
 */

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
} as const;

export const radii = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  full: '9999px',
} as const;

export const colors = {
  // Monotone calm neutral (updated per feedback)
  neutral: {
    50: '#f5f4f1',
    100: '#f0efea',
    200: '#e3e1d9',
    300: '#d4d1c7',
    500: '#5f5b54',
    700: '#3f3d38',
    900: '#242422',
  },
  accent: '#5f5b54',
  white: '#fff',
  border: '#e3e1d9',
  success: '#4a5c4f',
} as const;

export const type = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

export const shadow = '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)';
export const transition = 'all 180ms cubic-bezier(0.2, 0, 0, 1)';
