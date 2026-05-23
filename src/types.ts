/**
 * Core domain types for Gumi Cafe Map
 * Single source of truth — keep minimal.
 */

export interface Cafe {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  tags?: string[]; // venue-level characteristics (used for filtering)
}

export interface Review {
  rating: 1 | 2 | 3 | 4 | 5;
  note?: string;
  tags: string[]; // from fixed vocabulary
  updatedAt: string; // ISO-8601
}

export type ReviewsMap = Record<string, Review>;

export interface FilterState {
  query: string;
  minRating: number; // 0 = no filter, 1-5
  selectedTags: string[];
  onlyReviewed: boolean;
}

// Fixed tag vocabulary (v1 calm, from UX research)
export const TAG_VOCAB = [
  'WiFi',
  'Power / Outlets',
  'Quiet',
  'Dessert',
  'View / Scenic',
  'Work / Study friendly',
  'Great coffee',
  'Cozy / Aesthetic',
] as const;

export type Tag = (typeof TAG_VOCAB)[number];
