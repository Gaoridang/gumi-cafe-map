# Gumi Cafe Map

A simple, calm, UX-first React + TypeScript web app for viewing and privately reviewing cafes in Gumi (구미), South Korea.

**UX priority #1.** The entire experience is designed so you can open the map, spot a cafe, and log a 5-star review with optional note + tags in under 10 seconds — then see it reflected instantly on both the map and list.

## Key Features (v1)
- Interactive Leaflet map + synchronized list view (click either, both update)
- Fast inline review form (stars, textarea, multi-select tags)
- Live filters (search, min rating, tags, only-reviewed)
- Private persistence via localStorage + one-click JSON export/import
- Warm, restrained cafe-inspired design tokens (8pt rhythm, generous space)
- Mobile-first (bottom sheet on phone, split view on desktop)
- 100% client-side, zero backend, your data stays yours

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 — seed data is included so you can immediately explore and add real reviews.

## Dedicated Design Subagents (the reason this app feels good)

This project ships with its own `.grok/personas/` and `.grok/roles/` containing four original, purpose-built design agents:

- `ux-explorer` — research (tech choices, competitor UX, a11y, map patterns)
- `ux-designer` persona → produces reviewed `docs/UX-Spec.md`
- `ui-designer` persona → produces `docs/UI-Spec.md` + `src/design/DesignTokens.ts`
- `design-reviewer` persona → loops until **0 open issues** of any severity

**Before any UI or map change you (or future Grok sessions) must run the full design loop using these local agents until the reviewer reports 0 open issues.**

See `AGENTS.md` for the exact mandatory workflow and the "always use git worktree for clean branch" rule.

The design artifacts live in `docs/` (UX-Spec.md, UI-Spec.md, DesignTokens, research notes).

## Tech Stack
- Vite + React 18 + TypeScript (strict)
- Tailwind 3 + custom calm cafe palette + 8pt rhythm
- Leaflet + react-leaflet (light, free, great React integration)
- lucide-react icons
- localStorage + JSON for reviews

## Project Rules
- Read `AGENTS.md` (it is loaded automatically)
- All visual decisions go through the local design subagents first
- Keep v1 tiny and fast

## License
Personal project — your reviews, your data.

---

Built with Grok + dedicated UX/UI design subagents for maximum calm and speed.
