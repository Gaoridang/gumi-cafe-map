# Gumi Cafe Map — Design & Research Artifacts

All UX/UI work is produced by the dedicated local subagents in `.grok/personas/` (ux-designer, ui-designer, design-reviewer) and `roles/ux-explorer`.

## Current Recommended Direction

**v8 — Desktop Power Layout (Split Left)**  
`docs/mockup-v8-desktop-split-left.html`

- **Left area (wider, split)**: Filters column (search + rating + full-width tags) + Results list column
- **Center**: Large interactive map
- **Right**: Inspector panel with inline review form (stars + note + tags)

This is the current evolution after exploring multiple layouts (tabbed, bottom sheet, map-dominant, balanced split, etc.). It prioritizes desktop power-user ergonomics while staying calm and premium.

**Visual Language**: Clean light neutral (ElevenLabs-inspired day mode) with purple accent (`#7c3aed`), generous spacing, no warm café tones.

## Key Documents

- `research-*.md` — Output from ux-explorer subagents (map tech, UX patterns)
- `UX-Spec.md` — Core user flows, information architecture, success metrics, review capture journey
- `UI-Spec.md` — Visual language, design tokens, and component specifications (updated to match v8)
- `ux-design-summary.md` — Summary from the ux-designer subagent

## Mockup Versions (Layout Explorations)

We explored many different layout directions through interactive HTML mockups. The current chosen direction is:

- `mockup-v8-desktop-split-left.html` — **Current direction** (Desktop Power with split left panel: Filters column + Results list)

**Reference / Historical mockups still in the root:**
- `mockup.html` — Original balanced split (baseline)
- `mockup-v6-bottom-sheet.html` — Mobile reference (persistent draggable bottom sheet)

**Archived explorations** (moved to `docs/archive/`):
- v2 (Dark theme), v3 (Ultra Minimal), v4 (Map Dominant), v5 (Tabbed), v7 (earlier Desktop Power)

These archived files are kept for historical reference but are no longer the active direction.

## Implementation Notes

- The specs above are the single source of truth when moving from mockups to the real React + TypeScript implementation.
- Design tokens should eventually live in `src/design/DesignTokens.ts` and stay in sync with `UI-Spec.md`.
- When implementing, prefer the patterns validated in v8 (split left filters/results, full-width tag badges, contextual right inspector review form).

These artifacts exist to de-risk implementation and keep the team aligned on "calm, fast, personal" UX priority #1.
