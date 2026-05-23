# Design Decisions — Gumi Cafe Map

This document captures the key layout and direction decisions made during the exploration phase (May 2026).

## Final Chosen Direction (v8)

**Desktop Power Layout — Split Left Panel**

- Left area (~440px) split into two columns:
  - Filters column (search, rating, full-width tags)
  - Results list column
- Center: Large interactive map
- Right: Contextual inspector panel with inline ReviewForm

**Why this direction won:**

- Maximizes context on desktop (user can see filters, results, map, and review form simultaneously)
- Full-width tag badges in the filters column are much more scannable and clickable than multi-column grids
- The right inspector makes reviewing feel like a natural part of the workflow rather than a disruptive overlay
- Scales well for power users while still allowing graceful degradation on smaller screens

## Layout Explorations Summary

We created multiple high-fidelity interactive mockups to test different mental models:

| Version | Layout | Key Insight | Outcome |
|---------|--------|-------------|---------|
| Original | Balanced split (list ~380px + map) | Simple and familiar, but filters + list compete for left space | Good baseline |
| v4 | Map Dominant | Great for discovery, but list feels secondary | Useful for mobile thinking |
| v5 | Tabbed (Map ↔ List) | Very clean on mobile, but loses simultaneity on desktop | Good for simple flows |
| v6 | Persistent Bottom Sheet | Excellent mobile-native pattern | Adopted as mobile strategy |
| v7 | Desktop 3-column (filters + map + inspector) | Powerful, but filters + results were mixed in one sidebar | Direct predecessor to v8 |
| **v8** | **Split Left (Filters column + Results column)** | Best balance of power, clarity, and scannability | **Chosen direction** |

## Key Component Decisions

- **Tags / Categories**: Moved from 2-column grid to single-column full-width badges in the filters sidebar. This was a direct response to visual clutter and poor scannability in narrow columns.
- **Review Form on Desktop**: Moved from floating sheet/modal to persistent right inspector. This significantly improves the feeling of "reviewing in context."
- **Visual Language**: Evolved from warm café tones to a clean, neutral light palette with a strong purple accent (inspired by ElevenLabs day mode). This felt more premium and calm for a personal memory tool.

## Mobile Strategy

While v8 is optimized for desktop power use, the mobile experience will follow the pattern validated in v6:
- Map as the primary surface
- Draggable bottom sheet for the list + filters
- Stacking review sheet

## Future Work

- Extract a reusable `<Tag>` component (used in filters, results, and review form)
- Decide on exact mobile breakpoints and drawer/sheet behavior
- Consider adding visit date or photo support in a future iteration (currently out of scope for v1)

---

*This document is intentionally short and decision-focused. For detailed flows and metrics, see `UX-Spec.md`. For component specifications, see `UI-Spec.md`.*