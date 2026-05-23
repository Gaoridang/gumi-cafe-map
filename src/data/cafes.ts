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
  {
    id: 'c3',
    name: '이디야커피 구미옥계점',
    lat: 36.1378,
    lng: 128.4215,
    address: '경북 구미시 옥계동 123-4',
    tags: ['WiFi', 'Work / Study friendly'],
  },
  {
    id: 'c4',
    name: '투썸플레이스 구미산동점',
    lat: 36.1442,
    lng: 128.4321,
    address: '경북 구미시 산동읍 56-7',
    tags: ['Great coffee', 'Dessert'],
  },
  {
    id: 'c5',
    name: '할리스커피 구미점',
    lat: 36.1315,
    lng: 128.4123,
    address: '경북 구미시 공단동 89-2',
    tags: ['Power / Outlets', 'Quiet'],
  },
  {
    id: 'c6',
    name: '카페 아르떼',
    lat: 36.1421,
    lng: 128.4398,
    address: '경북 구미시 산동면 221-1',
    tags: ['Cozy / Aesthetic', 'View / Scenic'],
  },
  {
    id: 'c7',
    name: '로컬커피랩',
    lat: 36.1356,
    lng: 128.4254,
    address: '경북 구미시 옥계동 45-6',
    tags: ['Great coffee', 'WiFi'],
  },
  {
    id: 'c8',
    name: '모카스토리',
    lat: 36.1489,
    lng: 128.4412,
    address: '경북 구미시 인동동 78-9',
    tags: ['Dessert', 'Cozy / Aesthetic'],
  },
  {
    id: 'c9',
    name: '스터디존카페',
    lat: 36.1399,
    lng: 128.4187,
    address: '경북 구미시 옥계북로 33',
    tags: ['Work / Study friendly', 'Power / Outlets', 'Quiet'],
  },
  {
    id: 'c10',
    name: '뷰포인트카페',
    lat: 36.1523,
    lng: 128.4376,
    address: '경북 구미시 산동면 봉산리 310',
    tags: ['View / Scenic', 'Cozy / Aesthetic'],
  },
];

export const GUMI_CENTER = { lat: 36.13947, lng: 128.43079, level: 6 } as const;
