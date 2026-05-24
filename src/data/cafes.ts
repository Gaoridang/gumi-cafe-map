/**
 * Seed café data for Gumi (구미), South Korea.
 * Currently focused on Okgye / Sandong area.
 */

import type { Cafe } from '../types';

export const seedCafes: Cafe[] = [
  {
    id: 'c1',
    name: '퍼블릭커피로스터즈',
    lat: 36.1406311,
    lng: 128.4419852,
    address: '경상북도 구미시 산동면 봉산리 847-2',
    tags: ['Great coffee', 'Cozy / Aesthetic'],
  },
  {
    id: 'c2',
    name: '스타벅스 구미옥계점',
    lat: 36.1383,
    lng: 128.4196,
    address: '경북 구미시 옥계북로 20',
    tags: ['WiFi', 'Work / Study friendly', 'Power / Outlets'],
  },
];

export const GUMI_CENTER = { lat: 36.13947, lng: 128.43079, level: 6 } as const;
