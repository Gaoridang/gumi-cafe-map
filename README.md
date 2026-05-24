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

## Deploy to Vercel (Production)

The app is a fully static, client-side React + Vite build — ideal for Vercel.

### Prerequisites
- A Vercel account (free tier is sufficient).
- Kakao Developers JavaScript API key (same one used locally).
- In the Kakao console, add your production domain(s) under **Platform → Web** (e.g. `https://your-app.vercel.app` and any custom domain). This is the most common production blocker.

### Steps
1. Push your code to GitHub (Vercel works great with GitHub).
2. In Vercel, **Import Project** → select the repo.
3. Vercel auto-detects Vite. No changes needed for framework.
4. In **Project Settings → Environment Variables**, add:
   - `VITE_KAKAO_MAP_KEY` (value = your key)
   - Apply to **Production** and **Preview**.
5. (Optional but recommended) Copy `.env.example` to `.env` locally for development.
6. Deploy. Vercel will run `npm run build` and serve from `dist/`.

The included `vercel.json` provides:
- SPA fallback (query params for filters continue to work on refresh/share)
- Security headers
- Long-term caching for built assets

### Post-Deploy
- Test the map loads (Kakao domain whitelist is critical).
- Filters, reviews, localStorage export/import, and desktop experience work immediately.
- Known pre-production gap: mobile uses a basic responsive stack today. Full draggable bottom-sheet experience (per design specs) is the next focused slice.

Your data stays 100% on the user's device. No backend required.

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
