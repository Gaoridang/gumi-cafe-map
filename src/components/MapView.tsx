import React, { useEffect, useState } from 'react';
import { Map, CustomOverlayMap, useMap } from 'react-kakao-maps-sdk';
import type { Cafe, ReviewsMap } from '../types';
import { GUMI_CENTER } from '../data/cafes';
import { colors } from '../design/DesignTokens';

// Kakao Maps global (loaded via script in index.html)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export interface MapViewProps {
  /** All cafés that should have markers rendered. Map never unmounts on filter changes. */
  cafes: Cafe[];
  /** Per-café reviews (optional). Used for hasReview tint + aria labels on markers for instant reviewed-state sync. */
  reviews?: ReviewsMap;
  /** Bidirectional selection */
  selectedId: string | null;
  /** Called on marker click / keyboard activation. Parent updates selection + inspector. */
  onSelect: (id: string) => void;
  /** Optional subset for hiding markers (future filters). */
  visibleIds?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Controller that pans the Kakao map when selection changes from list/inspector.
 * Respects prefers-reduced-motion.
 */
function KakaoMapController({ selectedId, cafes }: { selectedId: string | null; cafes: Cafe[] }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId || !map) return;

    const cafe = cafes.find((c) => c.id === selectedId);
    if (!cafe) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const latlng = new window.kakao.maps.LatLng(cafe.lat, cafe.lng);

    // Center the map so the selected marker is exactly in the middle
    if (reduced) {
      map.setCenter(latlng);
    } else {
      map.panTo(latlng);
    }

    // Zoom in a bit when selecting a place so the marker feels prominent and centered
    const currentLevel = map.getLevel();
    const targetLevel = 15;

    if (currentLevel > targetLevel) {
      if (reduced) {
        map.setLevel(targetLevel);
      } else {
        map.setLevel(targetLevel, {
          animate: { duration: 300 },
        });
      }
    }
  }, [selectedId, cafes, map]);

  return null;
}

function MapViewImpl({
  cafes,
  selectedId,
  onSelect,
  visibleIds,
  reviews,
  className,
  style,
}: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const center = GUMI_CENTER;

  // Ensure Kakao SDK finishes loading (script uses autoload=false)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 100; // ~8 seconds

    const tryLoad = () => {
      attempts += 1;

      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setMapReady(true);
          setLoadError(null);
        });
      } else if (attempts > maxAttempts) {
        // Give up and show clear error
        setLoadError(
          'Failed to load Kakao Maps SDK (403 Forbidden). ' +
          'This almost always means your API key domain settings are incorrect.'
        );
      } else {
        setTimeout(tryLoad, 80);
      }
    };

    tryLoad();
  }, []);

  // Filter markers for future visibleIds support (small data set — simple & safe)
  const markersToShow = visibleIds
    ? cafes.filter((c) => visibleIds.includes(c.id))
    : cafes;

  // Error state - show helpful message
  if (loadError) {
    return (
      <div
        className={className ?? 'h-full w-full'}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#fef2f2',
          color: '#991b1b',
          fontSize: '13px',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kakao Map failed to load</div>
          <div style={{ opacity: 0.9 }}>{loadError}</div>
          <div style={{ marginTop: 12, fontSize: '12px', opacity: 0.75 }}>
            Fix: Go to Kakao Developers Console → your app → 플랫폼 → 웹<br />
            Add these domains exactly and wait 60 seconds:
          </div>
          <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: '11px', background: '#fee2e2', padding: '6px 10px', borderRadius: 6 }}>
            http://localhost:5173<br />
            http://localhost<br />
            http://127.0.0.1:5173<br />
            http://127.0.0.1
          </div>
        </div>
      </div>
    );
  }

  if (!mapReady) {
    return (
      <div
        className={className ?? 'h-full w-full'}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#71717a',
          fontSize: '13px',
        }}
      >
        Loading Kakao Map…
      </div>
    );
  }

  return (
    <div className={className ?? 'h-full w-full'} style={style}>
      <Map
        center={{ lat: center.lat, lng: center.lng }}
        level={center.level}
        style={{ width: '100%', height: '100%' }}
      >
        <KakaoMapController selectedId={selectedId} cafes={cafes} />

        {markersToShow.map((cafe) => {
          const isSelected = cafe.id === selectedId;
          const hasReview = !!reviews?.[cafe.id];

          // Common positioning so selected and unselected sit on the exact same spot
          const commonProps = {
            position: { lat: cafe.lat, lng: cafe.lng },
            xAnchor: 0.5,
            yAnchor: 0.5,
          } as const;

          if (isSelected) {
            // Selected: slightly larger, purple accent with soft ring
            return (
              <CustomOverlayMap
                key={cafe.id}
                {...commonProps}
                zIndex={100}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`${cafe.name} (selected)`}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    width: '28px',
                    height: '28px',
                    backgroundColor: colors.accent,
                    border: '2.5px solid #ffffff',
                    borderRadius: '9999px',
                    boxShadow: '0 0 0 5px rgba(124, 58, 237, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out',
                  }}
                  onClick={() => onSelect(cafe.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(cafe.id);
                    }
                  }}
                  title={cafe.name}
                />
              </CustomOverlayMap>
            );
          }

          // Default (unselected): green tint if reviewed (instant sync on save), neutral otherwise
          return (
            <CustomOverlayMap
              key={cafe.id}
              {...commonProps}
              zIndex={1}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={hasReview ? `${cafe.name} (reviewed)` : cafe.name}
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: '22px',
                  height: '22px',
                  backgroundColor: hasReview ? colors.success : colors.neutral[500],
                  border: '2px solid #ffffff',
                  borderRadius: '9999px',
                  boxShadow: hasReview ? '0 0 0 2px rgba(74, 124, 89, 0.25)' : '0 0 0 2px rgba(63, 63, 70, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out',
                }}
                onClick={() => onSelect(cafe.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(cafe.id);
                  }
                }}
                title={hasReview ? `${cafe.name} (reviewed)` : cafe.name}
              />
            </CustomOverlayMap>
          );
        })}
      </Map>
    </div>
  );
}

/** Memoized for calm, instant re-renders when only selection/visibility changes. */
export const MapView = React.memo(MapViewImpl);
