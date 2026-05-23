/**
 * Seed café data for Gumi (구미), South Korea.
 * Coordinates clustered around downtown / Gumi Station area (~36.119, 128.345).
 * User owns this file — edit/add real favorites anytime. Keep 10-15 for v1.
 */

import type { Cafe } from '../types';

export const seedCafes: Cafe[] = [
  {
    id: 'c1',
    name: 'Cafe Layer',
    lat: 36.1198,
    lng: 128.3442,
    address: 'Gumi-si, Gumi-dong',
    tags: ['Great coffee', 'Cozy / Aesthetic'],
  },
  {
    id: 'c2',
    name: 'The Quiet Cup',
    lat: 36.1205,
    lng: 128.3461,
    address: 'Near Gumi Station',
    tags: ['Quiet', 'Work / Study friendly'],
  },
  {
    id: 'c3',
    name: 'Aroma 128',
    lat: 36.1189,
    lng: 128.3435,
    address: 'Gumi Industrial Complex area',
    tags: ['Power / Outlets', 'WiFi'],
  },
  {
    id: 'c4',
    name: 'Bloom & Bean',
    lat: 36.1212,
    lng: 128.3478,
    address: 'Downtown Gumi',
    tags: ['Dessert', 'View / Scenic'],
  },
  {
    id: 'c5',
    name: 'Studio Roastery',
    lat: 36.1178,
    lng: 128.3421,
    address: 'Gumi-si',
    tags: ['Great coffee', 'Cozy / Aesthetic'],
  },
  {
    id: 'c6',
    name: 'Harbor Latte',
    lat: 36.1221,
    lng: 128.3490,
    address: 'Near the river walk',
    tags: ['View / Scenic', 'Quiet'],
  },
  {
    id: 'c7',
    name: 'Daily Dose',
    lat: 36.1192,
    lng: 128.3455,
    address: 'Central Gumi',
    tags: ['Work / Study friendly', 'Power / Outlets', 'WiFi'],
  },
  {
    id: 'c8',
    name: 'Pastel & Pour',
    lat: 36.1183,
    lng: 128.3418,
    address: 'Gumi Station south',
    tags: ['Dessert', 'Cozy / Aesthetic'],
  },
];

export const GUMI_CENTER = { lat: 36.1195, lng: 128.3447, zoom: 14 } as const;
