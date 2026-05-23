# UX Research: Patterns for Personal Cafe / Restaurant Logging + Map Apps

**Goal**: Calm, private memory-keeping for local users. UX priority #1: ridiculously fast capture + instant bidirectional feedback.

## Analyzed Examples (3-4)
- **Google Maps Saved Places / My Maps + Lists**: Users pin cafes, create private lists, add short notes/photos. Map markers and list items stay in sync; clicking one highlights the other and opens detail. Fast save via search or long-press.
- **Mapstr**: Personal interactive maps for restaurants/cafes. Add place → quick custom tags + comments (authentic opinions). Clean map + list organization, import from Google, private-by-default. Users praise "super simple", "intuitive", "no more scattered notes".
- **Wanderlog** (and similar trip/place loggers): Map + itinerary list with inline notes/reviews. Tap place → add rating/note/tags; updates reflect immediately. Focus on personal collection over heavy sharing.
- **StoryGraph-style clean trackers** + Korean cafe practices: Minimal logging (rate + short note + shelves/tags). No gamification. Koreans often use Google My Maps lists or Naver for "my Seoul cafes" / cafe-hopping routes; personal data stays private in simple spreadsheets or lightweight apps. Emphasis on aesthetic, calm discovery over social feeds.

## What Makes Review Capture Feel Fast & Low-Friction
- Pre-selection of the exact place (map or list tap) populates the form instantly.
- 1-2 tap primary actions (stars/emoji rating, big "Save").
- Optional fields (note, tags) with generous placeholders and smart defaults.
- Optimistic UI + instant visual confirmation (marker tint, list badge).
- Mobile: bottom sheet or inline card keeps context; no full-screen navigation.

## Best Practices for Bidirectional Map/List Selection (Core Delight)
- Shared data source + same click handler: map marker click → highlight + scroll list item + open quick form; list item click → flyTo marker + highlight + form.
- Generous targets (48px+ tappable areas, large custom markers).
- Subtle sync animations (no jank); selected state uses calm accent (e.g., filled marker or card border).
- Works identically on desktop split-view and mobile (map full, list collapsible or sheet).

## Common Pitfalls That Kill Calm/Minimal Feel
- Too many filters/chips visible by default (overwhelm; hide "advanced").
- Gamification (streaks, badges, points) — feels anxious, not personal.
- Slow sync or heavy modals (breaks "under 10s" magic).
- Tiny map targets or cluttered UI (frustrating on phone).
- Public/social defaults or photo upload walls in v1.

## Specific Microcopy & <8s Flow Ideas for "Log a Visit to This Cafe" (Phone)
1. Tap cafe (map or list) → bottom sheet opens with cafe name + "Log your visit?" header.
2. 5 tappable stars (or "Rate it" row) — instant selection.
3. Optional: "Short note (optional)" textarea, placeholder "Loved the quiet corner and oat latte".
4. 4-6 big tag chips (pre-selected none) — tap to toggle.
5. Primary button: "Save memory" (or "Log it") — shows "Saved ✓" toast + immediate marker/list update.
6. Close or "Add another note later".

Total taps: 3-5. Microcopy stays warm, personal, non-urgent: "Remember this one?" / "Quick memory for later".

## For the Gumi Cafe Map Context
**Minimal magical v1 feature set** (still feels special for private local memories):
- Interactive Leaflet map (react-leaflet) + synchronized list view (click either updates both) — directly matches current `package.json` + `README.md` spec.
- Fast inline/bottom-sheet review: 5-star rating + optional short note + multi-select tags.
- Live basic filters (search by name, min rating, tag, only-reviewed).
- Private persistence via localStorage + one-click JSON export/import (zero backend, your data stays yours).
- Mobile-first: bottom sheet on phone, split on desktop; warm restrained cafe palette.
- Instant feedback everywhere; no social, no photos, no advanced stats, no public sharing.

Cite current codebase: `src/design/DesignTokens.ts` (8pt rhythm, `cafe.50/100/500/700/900`, `accent`, `radii`, `spacing`), `src/index.css` (calm `--cafe-*` vars + `.leaflet-container` note for "simple, accessible map"), `README.md` (exact UX goal of "<10 seconds" log + sync map/list), `src/App.tsx` placeholder ready for these patterns.

**Recommended tag vocabulary for Korean cafes** (useful, not overwhelming — 6-8 fixed presets for v1):
- WiFi (와이파이)
- Power / Outlets (콘센트)
- Quiet (조용함)
- Dessert (디저트 / 케이크)
- View / Scenic (뷰 / 풍경)
- Work / Study friendly (공부하기 좋음 / 작업)
- Great coffee / Latte (커피 맛있음)
- Cozy / Aesthetic (분위기 좋음 / 인테리어)

Allow "custom" sparingly later; start fixed to keep calm.

## Direct Recommendations for ux-designer persona
- Make bidirectional selection the hero interaction: every map marker and list row must feel equally primary and instantly responsive (use Leaflet events + React state sync).
- Design the review flow as a persistent bottom sheet on mobile (never a blocking modal) with large, thumb-friendly controls; target <5 taps total.
- Use the exact 8pt tokens + cafe neutrals from `DesignTokens.ts` and CSS vars for all cards, chips, and markers to reinforce calm.
- Limit visible filters to 3-4 chips max in v1; "More filters" drawer only if needed — protect the minimal feel.
- Microcopy must be warm/personal: "Log your visit?", "Save memory", "Remember this one?" — test for Korean natural phrasing.
- Markers: subtle size/color change on "reviewed" state; list items show star rating + tag pills inline.
- Ensure 44-48px minimum touch targets everywhere; generous spacing (use `spacing.md/lg`); no dense lists or tiny icons that break the peaceful Gumi local memory vibe.
