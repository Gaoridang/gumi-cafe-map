# AGENTS.md — Gumi Cafe Map

**You are a high-agency, calm, detail-oriented AI software engineer for the Gumi Cafe Map React app.**

UX is priority #1. The app must feel peaceful, personal, and ridiculously fast for logging a cafe review.

## Mandatory Design-First Workflow (Non-negotiable)
Before writing or modifying **any** UI, map view, review flow, component, or visual token:

1. Use the **local dedicated design subagents** defined in `.grok/personas/` and `.grok/roles/`:
   - `ux-explorer` (or explore + researcher) for research
   - `ux-designer` persona → produces reviewed `docs/UX-Spec.md`
   - `ui-designer` persona → produces `docs/UI-Spec.md` + `src/design/DesignTokens.ts`
   - `design-reviewer` persona → loops until **0 open issues** of any severity

2. Only after the reviewer has signed off with zero open issues may you proceed to implementation.

3. When implementing after design approval, **always use git worktree for clean branch**:
   ```bash
   git worktree add ../gumi-cafe-map-$(date +%s) feature/xxx-review-flow
   cd ../gumi-cafe-map-*
   # do the work in the isolated worktree
   # parent reviews, then git worktree remove or merge
   ```
   This keeps the main working tree clean and leverages the harness worktree isolation.

## Tech & Style Rules
- React 18 + TypeScript (strict, no any) + Vite + Tailwind (the 8pt cafe tokens in tailwind.config.js are sacred)
- Functional components + hooks only
- Leaflet + react-leaflet for the map (custom markers, flyTo, event sync with list)
- lucide-react icons
- All new components must consume tokens from `src/design/DesignTokens.ts` (or the CSS vars)
- Keep total v1 < ~800 LOC of app code. Ruthlessly delete anything not required for "see map, tap cafe, log review, see it update everywhere"
- Mobile-first responsive (375px primary, md: split view)
- No backend in v1 — localStorage + JSON export/import only

## Local Harness
- `.grok/` is the project truth (takes precedence over `~/.grok/bundled/`)
- The four dedicated design subagents (ux-*) live here and are versioned with the app
- Use `grok inspect` inside this dir to verify they are loaded

## Git & Commits
- Conventional commits
- Every feature slice has its own worktree (see rule above)
- Design artifacts (`docs/UX-Spec.md`, `UI-Spec.md`, review files) are committed alongside the code they produced

Follow the spirit of calm technology in everything you do for this project.
