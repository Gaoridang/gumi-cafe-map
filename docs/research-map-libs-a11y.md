# Map Libraries & Accessibility Research — Gumi Cafe Map (v1)

**Prepared by ux-explorer** (read-only, high-reasoning). Actionable input for ux-designer + ui-designer. <700 words. Sources cited inline.

## Executive Recommendation for v1
**Keep Leaflet + react-leaflet.** Already perfectly installed, matches React 19, and is explicitly mandated in AGENTS.md + README.md for "light, free" custom markers, flyTo + list sync, and tiny v1 footprint (<800 LOC app code, mobile-first). 

MapLibre GL + react-map-gl is ~6× heavier and overkill for a simple personal cafe finder. Other options (OpenLayers, Mapbox) require keys or add even more weight. OSM tiles work well for Gumi with no API key or billing.

## Evidence from Current Codebase
- **package.json**: `"leaflet": "^1.9.4"`, `"react-leaflet": "^5.0.0"`, `"@types/leaflet": "^1.9.21"`, React `^19.2.6`. Exact match — react-leaflet v5 requires React 19+.
- **src/index.css**: `.leaflet-container` already styled with cafe background; calm card patterns prepared.
- **src/**: Boilerplate App.tsx + DesignTokens.ts (8pt cafe neutrals) + standard Vite + TS + Tailwind. No MapView/CafeList yet — clean slate for sync patterns.
- **AGENTS.md / README.md**: "Leaflet + react-leaflet for the map (custom markers, flyTo, event sync with list)", "light, free, great React integration". Mobile-first 375px primary.
- **vite.config.ts / tsconfig**: Vanilla — no map-specific config or blockers.

## Map Library Comparison (Simple Cafe Finder, 2026)
Focus areas for personal React app:

- **Bundle size**: Leaflet core ~42 kB gzipped (145 kB min). MapLibre-GL core ~268 kB gzipped (1 MB min). react-leaflet wrapper is tiny; react-map-gl adds more. Leaflet wins for fast mobile loads and v1 size discipline.
- **No API key**: Both free (OSM / self-hosted vector). Leaflet simpler out-of-box.
- **Custom markers (rating-colored)**: Leaflet excels — `L.icon()` or `L.divIcon()` with CSS classes for rating colors (green ≥4★, etc.). Easy touch targets. MapLibre possible but more layers/JS.
- **flyTo + list sync**: Both support. Leaflet `useMap` + `flyTo(latLng, zoom, {duration})` is lightweight and predictable for two-way state (selectedId drives both map and list highlight).
- **Mobile perf**: Leaflet superior — less JS to parse on low-end phones. Critical for bottom-sheet + map on 375px.
- **TypeScript**: Both excellent. @types/leaflet already present and high quality.
- **Accessibility**: Comparable baseline. Leaflet has official keyboard + ARIA guidance. MapLibre vector can help contrast but adds complexity.

**Others**: OpenLayers heavier and less "React-native". Google/Mapbox = keys + cost. **Recommendation: stay with Leaflet.**

## Exact Install + Basic Usage (Recommended — Already Done)
```bash
# Already in package.json — no change needed
npm install leaflet react-leaflet
# types included
```

**Basic MapView skeleton** (for ux/ui designers to spec against):
```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Vite icon fix (common gotcha — put in main.tsx or component)
L.Icon.Default.mergeOptions({ /* iconRetinaUrl, iconUrl, shadowUrl from imports */ });

export function MapView({ cafes, selectedId, onSelect }: Props) {
  return (
    <MapContainer center={[36.12, 128.34]} zoom={14} style={{ height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {cafes.map(c => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={getRatingIcon(c.avgRating)} // L.divIcon with className for color
          eventHandlers={{ click: () => onSelect(c.id) }}
          title={c.name} // critical for a11y name
        >
          <Popup>{c.name} — {c.avgRating}★</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

**Sync pattern note**: Parent or context owns `selectedId`. List item click → `onSelect` + `mapRef.current?.flyTo(...)`. Map marker click → same. Use `useEffect` + ref for imperative fly.

## Korea-Specific Tile / CORS Issues
- Standard OSM tiles work well for Gumi (Korean names present). Center: ~36.1136, 128.336.
- No CORS problems for image tiles in modern browsers.
- Personal/local app usage: fair-use limits not an issue. Avoid high-traffic abuse.
- Do not use Google (billing), Kakao/Naver (keys + restrictive terms) for v1.
- Future: If labels need improvement, consider lightweight alternatives but not before UX-Spec.

## Accessibility for Map + Synchronized List UIs
**Keyboard navigation for markers**:
- Leaflet markers are natively tabbable. Provide unique descriptive names via `title` / `alt` on `<Marker>` or `aria-label` inside `L.divIcon` HTML. Follow official Leaflet accessibility example: meaningful alt for every marker, test keyboard + screen reader.

**ARIA patterns for live filter results & selection sync**:
- Filters: `<div aria-live="polite" aria-atomic="true">{filtered.length} cafes match your filters</div>`.
- List: `<ul role="listbox" aria-label="Cafes in Gumi"> <li role="option" aria-selected={id===selectedId} ...>`.
- Selection change: polite live-region announcement or `aria-live` update.

**Focus management (list ↔ map clicks)**:
- Visual sync via shared `selectedId` + CSS (`.selected` on list cards + map marker icons). Avoid automatic focus stealing.
- List click: highlight + scroll list item into view (use ref), fly map.
- Map marker (keyboard): update list highlight + `scrollIntoView` on matching list item.
- Container: label map region; use `role="application"` sparingly. Popups must be Esc-closable.

**Reduced-motion & high-contrast**:
- `prefers-reduced-motion`: `map.flyTo(pos, z, { duration: reduced ? 0 : 0.8, animate: !reduced })` or fall back to `setView`.
- High contrast / forced-colors: `@media (forced-colors: active)` rules for markers; use `currentColor`, high-contrast SVGs, and ensure 4.5:1+ ratios. Test Windows HCM + VoiceOver/NVDA.

## Gotchas & Implementation Notes for MapView + CafeList
- Icon asset URLs in Vite: import PNGs or copy to `public/` and reference.
- Custom rating markers: `L.divIcon({className: `rating-${Math.floor(r)}`, html: `<span>${r}</span>`})` — style with Tailwind/design tokens, min 44×44 px touch/keyboard target.
- Two-way sync: lift state to parent; expose flyTo via `useImperativeHandle` or simple ref.
- Mobile: map takes most space; list as scrollable or bottom sheet. Filters above both.
- Performance: small seed data in v1 — no virtualization needed yet.
- Testing: keyboard-only tab through markers, SR reads names + live counts, filter updates announced, reduced-motion disables fly.
- Keep calm: generous spacing, restrained colors, instant feedback.

**Next for ux-designer**: Define exact user flows (select from list vs map, filter live update, review inline) using this as foundation. ui-designer: map marker visuals + list card states + focus/hover styles using DesignTokens.

## Sources / Links
- Leaflet accessibility: https://leafletjs.com/examples/accessibility/
- Bundle sizes & comparisons: Bundlephobia + recent 2025/2026 analyses.
- react-leaflet v5 + React 19: official repo/docs.
- Gumi coords: public lat/long sources.
- Project: AGENTS.md, package.json, README.md, src/index.css, DesignTokens.ts.

All recommendations prioritize calm, fast, personal UX for a private Gumi cafe review tool.
