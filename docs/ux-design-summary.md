# UX Design Summary — Gumi Cafe Map

**Produced:** Complete `docs/UX-Spec.md` (and this summary) by ux-designer persona following exact instructions in `.grok/personas/ux-designer.toml`, using `docs/research-map-libs-a11y.md` + `docs/research-ux-patterns-cafe-apps.md` as primary inputs plus full project exploration (AGENTS.md, README, DesignTokens.ts, current source, tokens).

**Core output:** A calm, concrete, implementable UX spec that enforces "UX priority #1" (ridiculously fast <8s personal review logging with bidirectional map↔list sync as the delight). Includes:
- Executive summary + quantifiable success metrics (time-to-log <8s, first-review <20s, calm/return visits).
- Target user (busy Gumi local, private memory keeper).
- IA with Mermaid diagram (persistent split desktop / toggle + bottom-sheet mobile).
- Primary journeys and exact <10s review capture flow with Mermaid sequence + microcopy ("Remember [Cafe Name]?", "Save memory", warm personal tone).
- Full fixed tag vocabulary (8 from research: WiFi, Power/Outlets, Quiet, etc.).
- Detailed mobile/desktop behaviors, edge cases, and accessibility (keyboard, live regions, reduced-motion, Leaflet a11y per research).
- Ordered PR Plan of 6 tiny independent slices (MapView, List, ReviewForm, Filters, Persistence, Polish) ready for ui-designer + design-reviewer + worktree implementation.
- Specific Open Questions for the ui-designer (marker visuals, sheet post-save behavior, Korean phrasing, etc.).

**Tone & principles upheld throughout:** Peaceful minimalism, generous targets (44px+), optimistic instant feedback, no noise/gamification/social, private localStorage only, Leaflet recommended, everything reversible and glanceable. Spec is ready for ui-designer to produce UI-Spec.md updates + component visuals using the 8pt cafe tokens. Next: design-reviewer loop to 0 open issues before any code.

All decisions directly support the metrics and "review in seconds, think less" mandate. References full research and codebase state.
