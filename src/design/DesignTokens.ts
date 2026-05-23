/**
 * Design Tokens for Gumi Cafe Map — authoritative (from ui-designer, v8+)
 * Clean light neutral palette (ElevenLabs-inspired day mode) with purple accent.
 * No warm café tones. 8pt rhythm. Use these everywhere (JS + Tailwind alignment).
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
  // Clean neutral light (ElevenLabs-inspired)
  neutral: {
    50: '#f8f8f9',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    500: '#3f3f46',
    700: '#27272a',
    900: '#111113',
  },
  accent: '#7c3aed',        // Signature purple
  accentLight: '#a78bfa',
  white: '#ffffff',
  border: '#e4e4e7',
  success: '#4a7c59',       // subtle green for saved states
} as const;

export const type = {
  sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

export const shadow = '0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)';
export const transition = 'all 160ms cubic-bezier(0.2, 0, 0, 1)';
