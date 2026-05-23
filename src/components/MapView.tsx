import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import type { Cafe, ReviewsMap } from '../types';
import { GUMI_CENTER } from '../data/cafes';
import { colors } from '../design/DesignTokens';

export interface MapViewProps {
  /** All cafés that should have markers rendered. Map never unmounts on filter changes. */
  cafes: Cafe[];
  /** Per-café reviews (optional). Drives rating color + reviewed state on markers. */
  reviews?: ReviewsMap;
  /** Bidirectional selection */
  selectedId: string | null;
  /** Called on marker click / keyboard activation. Parent updates selection + inspector. */
  onSelect: (id: string) => void;
  /** Optional subset for dimming (future filters). Omit or pass all for full opacity. */
  visibleIds?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/** Derives marker background strictly from locked v8 DesignTokens (no magic hexes). */
function getMarkerColor(rating: number | null | undefined): string {
  if (!rating) return colors.neutral[500];      // unreviewed — dark neutral
  if (rating >= 4.5) return colors.accent;       // #7c3aed — strongest memory
  if (rating >= 4.0) return colors.accentLight;  // #a78bfa
  if (rating >= 3.5) return colors.neutral[700]; // #27272a — calm mid
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
    className: `cafe-marker ${hasReview ? 'reviewed' : 'unreviewed'} ${isSelected ? 'selected' : ''}`,
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

/** Flies the map to the selected café when selection changes from outside (list/inspector).
 *  Respects prefers-reduced-motion exactly (per UX-Spec + persona). */
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
  }, [selectedId, cafes]);

  return null;
}

function MapViewImpl({
  cafes,
  reviews,
  selectedId,
  onSelect,
  visibleIds,
  className,
  style,
}: MapViewProps) {
  const center = GUMI_CENTER;

  return (
    <div className={className ?? 'h-full w-full'} style={style}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={center.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={true}
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
              eventHandlers={{
                click: () => onSelect(cafe.id),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

/** Memoized for calm, instant re-renders when only selection/visibility changes. */
export const MapView = React.memo(MapViewImpl);
