# UI Specification & Design Tokens — Gumi Cafe Map

**Prepared by:** ui-designer persona (following approved UX-Spec)  
**Visual Language:** Warm, calm, generous, premium restraint. "A quiet notebook in a sunny Gumi cafe."

---

## Design Tokens (src/design/DesignTokens.ts — authoritative)

**Current Direction (v8+)**: Clean light neutral palette (ElevenLabs-inspired day mode) with purple accent. No warm café tones.

```ts
export const spacing = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '2.5rem' } as const;
export const radii = { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px' } as const;

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
```

Usage: always reference via Tailwind or these values. No magic numbers.

## Component Specs (key ones) — Current (v8 Desktop Split Left)

**Filters Column (leftmost, ~190px)**
- Search: clean input with bottom or subtle border focus
- Rating pills: compact, high-contrast active state using accent
- Tags: **full-width badges** (single column), `w-full`, good padding, clear active state with purple background. No outer container background — just clean list under label.

**Results List Column (next to filters)**
- Scannable rows with name, address, rating, subtle tags preview
- Selected state: purple left border or soft background highlight
- Dense but comfortable (more compact than main cards)

**Map**
- Large central area
- Custom rating-colored markers with strong selected state (scale + ring)

**Right Inspector Panel**
- Shows selected café details + **full inline ReviewForm** (no overlay on desktop)
- Stars, note textarea, tag chips, save button all visible in context
- Feels like a contextual properties panel

**ReviewForm (desktop inspector)**
- Stars: large tappable row
- Note: generous textarea
- Tags: full-width or well-spaced pills
- Save: prominent full-width accent button

**Tag Component (future)**
- Reusable pill/badge used in:
  - Filters (selectable)
  - Results preview (read-only)
  - Review form (multi-select)
- States: default, active/selected, hover
- Consistent sizing and spacing across contexts

## Responsive
- **Desktop (≥1024px)**: 3-column power layout — Left (Filters 190px + Results) | Map (flex-1) | Right Inspector (~380px)
- **<1024px**: Graceful collapse — left sidebars become drawers, right panel becomes bottom sheet
- **Mobile**: Map dominant + bottom sheet for list + stacked review sheet (see v6 for reference pattern)

## Polish Rules
- Primary surfaces: pure white on very light neutral background
- Accent color (`#7c3aed`) used sparingly for primary actions and selection
- Generous spacing and comfortable tap targets (min 44px where interactive)
- Clear visual hierarchy: filters feel grouped but not boxed unless necessary
- All motion is calm and purposeful (160–200ms)

This system + the UX flows = the calm, fast, personal Gumi Cafe Map experience — optimized for desktop power use while remaining pleasant on smaller screens.
