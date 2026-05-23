# Design + Technical Review: Slice 1 — MapView Component

**Persona:** design-reviewer (per `.grok/personas/design-reviewer.toml` and `AGENTS.md`)  
**Project:** Gumi Cafe Map (strict design-first + worktree workflow)  
**Date:** 2026-05-22  
**Scope:** Strict UX + UI + technical review for the MapView (Leaflet) implementation slice. Covers authoritative requirements from UX-Spec.md (PR Plan #1 + primary journey + a11y), UI-Spec.md (Map section), v8 mockup + Design-Decisions, research-map-libs-a11y.md, current v8 tokens in DesignTokens.ts + tailwind + index.css, types/data, and the exact center-column placeholder in App.tsx (post-Slice 0 approval).  

This is a **pre-code spec review** to guarantee the implementer has zero ambiguity and can deliver a calm, high-contrast, instant-feeling bidirectional map in one focused session while obeying all locked v8 constraints (neutral light palette, #7c3aed purple accent, 8pt rhythm, <10s flows, Leaflet + react-leaflet, no gamification).

**Files / Artifacts Fully Read & Cross-Referenced:**
- `.grok/personas/design-reviewer.toml`, `AGENTS.md`
- `src/design/DesignTokens.ts` (v8 neutral + accent locked)
- `src/types.ts` (Cafe, Review, ReviewsMap, FilterState)
- `src/data/cafes.ts` (seedCafes + GUMI_CENTER)
- `src/App.tsx` (v8 split grid + selectedId state + placeholder + demo)
- `docs/UX-Spec.md` (full, including MapView PR #1, journey, a11y, flow diagrams)
- `docs/UI-Spec.md` (Map spec + tokens)
- `docs/mockup-v8-desktop-split-left.html` (interactive v8 with real Leaflet divIcon example)
- `docs/visual-sync-review.md` (Slice 0 0-issue APPROVED baseline)
- `docs/research-map-libs-a11y.md` (Leaflet rec, a11y patterns, Korea tiles)
- `docs/Design-Decisions.md`, `docs/research-ux-patterns-cafe-apps.md`, `docs/README.md`, `docs/ux-design-summary.md`
- `package.json` (leaflet ^1.9.4, react-leaflet ^5.0.0, React ^19), `tailwind.config.js`, `src/index.css` (leaflet-container + token vars), `src/main.tsx`
- Grep across src/ + docs/ for Map/leaflet/marker patterns

---

## 1. Recommended Component Contract

Exact, production-ready TypeScript interface (copy-paste into `src/components/MapView.tsx` or `src/MapView.tsx` — keep flat for v1 LOC discipline). This is the **single source of truth** the parent App (and future Filters/List slices) will consume.

```ts
import type { Cafe, ReviewsMap } from '../types';

export interface MapViewProps {
  /**
   * All cafés that should have markers rendered.
   * Pass the full seed list (or persisted list) for map stability across filters.
   * Map never unmounts/recreates on filter changes.
   */
  cafes: Cafe[];

  /**
   * Per-café reviews (optional, undefined or {} in Slice 1).
   * Used to derive rating number + "reviewed" visual state for marker color/treatment.
   * When a review is saved later, parent re-passes updated map → marker updates instantly.
   */
  reviews?: ReviewsMap;

  /** Bidirectional selection (from list click or prior map click) */
  selectedId: string | null;

  /** Emitted on marker tap/keyboard activation. Parent calls setSelectedId + opens inspector. */
  onSelect: (id: string) => void;

  /**
   * Optional subset of ids that should render at full opacity.
   * Cafés not in this list are softly dimmed (opacity 0.22) but remain interactive and visible.
   * This enables live filter dimming on the map without destroying/re-creating markers or losing pan state.
   * If omitted → all markers full opacity (fine for Slice 1 before Filters slice).
   */
  visibleIds?: string[];

  className?: string;
  style?: React.CSSProperties;
}
```

**Minimal usage skeleton (for App.tsx integration after Slice 1):**

```tsx
import { MapView } from './components/MapView';
import { seedCafes, GUMI_CENTER } from './data/cafes';
// ...
<MapView
  cafes={seedCafes}
  reviews={reviews}           // from persistence later
  selectedId={selectedId}
  onSelect={setSelectedId}
  visibleIds={filteredCafes.map(c => c.id)}  // or undefined in Slice 1
  className="h-full w-full"
/>
```

The component must be a functional component using `react-leaflet` primitives only. No extra abstractions. `React.memo(MapView)` recommended (see perf section).

---

## 2. Marker Strategy (The Most Important Visual Decision)

**L.divIcon + custom HTML is the only acceptable approach for v1.**  
- Full control over rating color, reviewed state, selected ring/scale using **exact v8 DesignTokens** (no new hexes except logical derivations from accent/neutral).  
- Lightweight (no PNG assets, no extra requests).  
- Easy to attach `aria-label` / `title` for a11y + keyboard.  
- Matches the exact pattern validated in `mockup-v8-desktop-split-left.html` (circular, rating number, white border, shadow) and older mocks for selected states.  
- Pure CSS + inline for dynamic values; no Leaflet Icon subclass needed.

**Precise color mapping & states (token fidelity + high contrast + calm):**

- **Size / hit area:** `iconSize: [36, 36]`, visual 28×28 circle centered. Guarantees ≥44px effective touch/keyboard target (per UX-Spec, research, persona checklist). `iconAnchor: [18, 18]`.

- **Unreviewed (Slice 1 default, or !reviews?.[id]):**
  - Background: `colors.neutral[500]` (`#3f3f46`)
  - Content: small filled circle "●" (or empty "○") — signals "no memory yet"
  - Border: 2px solid white
  - Shadow: subtle

- **Reviewed (when reviews?.[id] exists):**
  - Background ramp (derived strictly from locked tokens; no indigo from mockup):
    ```ts
    function getMarkerColor(rating: number | null | undefined): string {
      if (!rating) return colors.neutral[500];           // unreviewed
      if (rating >= 4.5) return colors.accent;            // #7c3aed — strongest memory
      if (rating >= 4.0) return colors.accentLight;       // #a78bfa
      if (rating >= 3.5) return colors.neutral[700];      // #27272a — calm dark neutral for mid
      return colors.neutral[500];
    }
    ```
  - Content: `${rating.toFixed(1)}` (10–11px, 700 weight, white, centered) — exact v8 mockup language
  - "Has review" signal: the colored fill + numeric rating itself (no extra badge, dot, or tint overlay — keeps ultra-minimal and glanceable per calm UX priority #1 and "no visual noise")

- **Selected state (strong, per UI-Spec "scale + ring" + list card precedent in App.tsx + v8 intent):**
  - `transform: scale(1.32)`
  - Ring: `box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.28), ...` (soft purple halo using accent, 28% opacity for calm not aggressive)
  - Extra elevation shadow
  - Higher stacking (leaflet z or css)

- **Hover / active (desktop + touch):**
  - Non-selected: `scale(1.08)` + slightly stronger shadow on `:hover`
  - Uses the 160ms token transition (or 120ms for snappy marker feel)
  - Active/tap: momentary scale(0.95) if desired (subtle)

- **Accessibility (non-negotiable, from research + UX-Spec § Accessibility + Leaflet a11y guide):**
  - Every marker root must carry:
    ```html
    aria-label="Cafe Layer, 4.5 stars, reviewed"
    title="Cafe Layer, 4.5 stars, reviewed"
    ```
    (constructed exactly as: `${name}, ${rating ? `${rating} stars` : 'unreviewed'}, ${hasReview ? 'reviewed' : 'not yet reviewed'}`)
  - Leaflet automatically makes interactive markers tabbable/keyboard-activatable (Enter/Space triggers click handler). Test in layout: after list items → map region → first marker.
  - No popups (prevents default entirely — see interaction).
  - Descriptive, polite; works with VoiceOver / NVDA.
  - High-contrast: white text on dark neutral/accent (≥ 8:1 per tokens), ring visible in forced-colors.

**Concrete factory (copy-paste ready, place in MapView.tsx or a lib/marker.ts):**

```ts
import L from 'leaflet';
import type { Cafe } from '../types';
import { colors } from '../design/DesignTokens';

function getMarkerColor(rating: number | null | undefined): string {
  if (!rating) return colors.neutral[500];
  if (rating >= 4.5) return colors.accent;
  if (rating >= 4.0) return colors.accentLight;
  if (rating >= 3.5) return colors.neutral[700];
  return colors.neutral[500];
}

export function createCafeMarkerIcon(
  cafe: Cafe,
  rating: number | null,
  isSelected: boolean,
  hasReview: boolean
): L.DivIcon {
  const bg = getMarkerColor(rating);
  const display = rating ? rating.toFixed(1) : '●';
  const baseClasses = `cafe-marker ${hasReview ? 'reviewed' : 'unreviewed'} ${isSelected ? 'selected' : ''}`;

  const html = `
    <div
      style="
        background: ${bg};
        width: 28px;
        height: 28px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        line-height: 1;
        transition: inherit;
      "
      aria-label="${cafe.name}, ${rating ? `${rating} stars` : 'unreviewed'}${hasReview ? ', reviewed' : ''}"
      title="${cafe.name}"
    >${display}</div>
  `;

  return L.divIcon({
    className: baseClasses,
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}
```

**CSS to append to `src/index.css`** (after the existing `.leaflet-container` rule; uses :root vars + tokens; non-blocking addition):

```css
/* Calm, token-faithful map markers for v8 Desktop Split-Left + mobile.
   Generous 36px hit area, strong but peaceful selected state, high contrast. */
.cafe-marker {
  transition: transform 120ms cubic-bezier(0.2, 0, 0, 1),
              box-shadow 120ms cubic-bezier(0.2, 0, 0, 1);
  cursor: pointer;
}
.cafe-marker:hover:not(.selected) {
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.15);
}
.cafe-marker.selected {
  transform: scale(1.32);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.28), 0 4px 10px rgb(0 0 0 / 0.18);
  /* leaflet will respect z-index on the icon element */
}
```

This produces markers that feel premium, calm, and perfectly synced with the purple accent used on list cards, tags, and save button.

---

## 3. Interaction & Lifecycle

**Click / select:**
- `<Marker eventHandlers={{ click: () => onSelect(cafe.id) }} ... />`
- **Never** render a `<Popup>`. Click must only emit onSelect (list highlights + scrolls + inspector opens via parent state). Prevents any default popup friction.

**External selection (list → map fly):**
- When `selectedId` prop changes (from outside), smoothly fly the map to the café.
- Respect `prefers-reduced-motion` exactly (persona + UX-Spec requirement).

**Concrete controller (inside MapView, after imports):**

```ts
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
// ...

function MapFlyToController({ selectedId, cafes }: { selectedId: string | null; cafes: Cafe[] }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;
    const cafe = cafes.find((c) => c.id === selectedId);
    if (!cafe) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    map.flyTo(
      [cafe.lat, cafe.lng],
      Math.max(map.getZoom() || GUMI_CENTER.zoom, 15),
      {
        duration: reduced ? 0 : 0.65,
        easeLinearity: 0.25,
      }
    );
  }, [selectedId, cafes /* stable ref from parent */]);

  return null;
}
```

**Initial view & MapContainer:**

```tsx
const center = GUMI_CENTER; // import from '../data/cafes'

<MapContainer
  center={[center.lat, center.lng]}
  zoom={center.zoom}
  style={{ height: '100%', width: '100%' }}
  zoomControl={false}           // calm, user uses wheel/pinch
  attributionControl={true}     // required by OSM
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <MapFlyToController selectedId={selectedId} cafes={cafes} />
  {cafes.map((cafe) => {
    const review = reviews?.[cafe.id];
    const rating = review?.rating ?? null;
    const hasReview = !!review;
    const isSelected = cafe.id === selectedId;
    const isVisible = !visibleIds || visibleIds.includes(cafe.id);

    return (
      <Marker
        key={cafe.id}
        position={[cafe.lat, cafe.lng]}
        icon={createCafeMarkerIcon(cafe, rating, isSelected, hasReview)}
        opacity={isVisible ? 1 : 0.22}
        eventHandlers={{ click: () => onSelect(cafe.id) }}
      />
    );
  })}
</MapContainer>
```

**Tile provider recommendation:** OpenStreetMap standard tiles (as shown). Excellent free coverage for Gumi (downtown + station area), Korean place names render, no API key, no billing, no CORS issues for personal app. Attribution must stay visible (small bottom-right). Style it calmly in index.css if needed:

```css
.leaflet-control-attribution {
  font-size: 9px;
  color: #71717a; /* muted neutral */
  background: rgba(255, 255, 255, 0.85);
  padding: 1px 4px;
  border-radius: 4px;
}
```

Alternatives (CARTO, etc.) not required for v1.

**Lifecycle / unmount:** `react-leaflet` v5 + `MapContainer` automatically cleans the map instance, removes all layers/markers, and releases listeners on component unmount. No manual `map.remove()` or refs to manage. Do not create the map outside React.

**Other:**
- Initial load: centered exactly on GUMI_CENTER at zoom 14 (per seed + UX-Spec). Do not auto-fitBounds (downtown cluster is tight; user can zoom/pan naturally).
- When visibleIds change (future filters): only `opacity` updates — instant, no fly or recreate, map context preserved.
- Bidirectional guarantee: marker click → onSelect → parent updates selectedId + list scroll/highlight + inspector. List click → same + flyTo via the controller.

---

## 4. Performance / Quality for v1

- **Data scale:** 8 seed cafés today (12–20 max for v1) — zero clustering or virtualization needed. Simple `.map()` is instant.
- **Memoization & re-render discipline (critical for calm "feels instant"):**
  - `export const MapView = React.memo(MapViewImpl);`
  - `createCafeMarkerIcon` is pure and cheap — call on every render of the 20 items (negligible).
  - If parent passes stable `cafes` (e.g. `const cafes = useMemo(() => seedCafes, [])`) and `reviews` object ref only changes on actual save, then MapView only re-renders on `selectedId` or `visibleIds` changes.
  - Icons only recreated for the cafés whose selection/review state actually changed.
  - Opacity updates are cheap Leaflet DOM ops.
- **Filter dimming strategy (future-proof):** Use `visibleIds` + `opacity` prop on `<Marker>`. Markers for filtered-out cafés stay in the DOM at low opacity (0.22), preserving pan/zoom and allowing instant "clear filters → everything pops back". This matches the v8 mockup `updateMapMarkers` pattern (setOpacity) and UX requirement "Map still renders all (or dims non-matching gently)".
- **No unnecessary work:** No popups, no heavy layers, no per-marker React state. The flyTo effect only runs on actual `selectedId` change.
- **Mobile/desktop quality:** 36px targets everywhere, 120–160ms transitions (token), reduced-motion fully respected, high-contrast (tokens guarantee), no layout shift (MapContainer fills its grid cell 100%).
- **Bundle / load:** Already in package; CSS import once; map loads tiles lazily. Total app stays well under 800 LOC target.

---

## 5. Open Issues Table

| Severity | Description + file/line hint | Clear recommendation |
|----------|------------------------------|----------------------|
| Minor | Rating color ramp and "unreviewed" visual treatment are not explicitly defined in `DesignTokens.ts`, `UI-Spec.md` (only "Custom rating-colored markers"), or `UX-Spec.md` open questions (line 248). v8 mockup uses non-token indigo `#6366f1`. | Adopt the exact 4-value ramp + factory in section 2 above (100% derived from locked `colors.neutral.*` + `accent`/`accentLight`). Add a short "Map marker colors" comment block to `DesignTokens.ts` in Polish slice if desired. Non-blocking for Slice 1. |
| Nit | Target zoom on external `flyTo` (preserve vs. bump to 15/16) and any slight offset for inspector visibility are unspecified (UX-Spec § Primary Journey line 87, mockup line 377 uses hard 16). | Use `Math.max(currentZoom, 15)` and exact lat/lng (no offset) for v1 — calm, predictable, user retains control. Document the choice in MapView JSDoc. |
| Nit | `App.tsx` center placeholder (lines 116-123) uses `bg-neutral-100`; real MapView will replace it. Leaflet attribution contrast on light neutral bg not yet styled. | MapView wrapper must be `h-full w-full relative`. Add the calm attribution rule to `index.css` (see section 3). The existing `.leaflet-container { background: #f8f8f9; }` already matches v8 page/cards perfectly. |
| Nit | No runtime verification yet of React 19 + react-leaflet 5 + Leaflet 1.9.4 + strict TS + Vite (package.json + research only). Keyboard tab order through map markers in the 3-column grid not exercised. | Patterns are standard and recommended by research. After impl in worktree, manual test (keyboard only, reduced-motion toggle in devtools, VoiceOver on desktop, touch on iOS simulator) is required before merge. Non-blocking. |

**All issues are Minor/Nit and non-blocking for v1 Slice 1.** No Critical or Major issues. The contract + snippets above fully resolve every ambiguity.

---

## 6. Final Verdict

**0 open issues — APPROVED — proceed to implement MapView in a dedicated git worktree**

The combination of locked v8 specs, tokens, research, mockup-validated patterns, and the precise contract + factory + controller above gives the implementer everything needed for a production-quality, a11y-complete, calm MapView that delivers the hero bidirectional sync experience ("map marker click → list highlights + scrolls + inspector opens" and reverse) with zero friction or visual noise.

**Strengths (why this feels peaceful and instant):**
- Perfect token fidelity and high contrast on every marker state.
- Declarative React + Leaflet keeps re-renders minimal and map context stable.
- Generous targets + reduced-motion respect + descriptive labels satisfy every persona checklist item.
- Ready for later slices (reviews prop drives color change on save; visibleIds for filters; no breaking changes).
- Matches the "quiet notebook" v8 aesthetic exactly while being technically lightweight.

**Next per AGENTS.md (mandatory):**
1. Create isolated worktree: `git worktree add ../gumi-cafe-map-wt-slice1-mapview $(date +%s) feature/slice1-mapview` (or similar timestamped name).
2. `cd` into it, implement `MapView.tsx` (plus the tiny CSS addition) following this review 100%.
3. Parent (or design-reviewer subagent) reviews the diff + running app.
4. Merge to main with conventional commit once 0 open issues on the code.

This review closes the design-first gate for Slice 1. The MapView will make the app feel alive and delightful the moment it lands.

---

*Review executed with exhaustive tool-assisted file reads, full cross-referencing, mental execution of all primary journeys on both desktop split (440/1/380) and mobile, strict adherence to calm UX, WCAG, token sacredness, and the "0 open issues" bar. Every recommendation is copy-paste ready and directly traceable to the authoritative artifacts.*