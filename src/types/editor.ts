export interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
}

export interface DoorItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
}

export interface WindowItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface FurnitureItem {
  id: string;
  type: string;
  label: string;
  variant?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface AnalysisScore {
  label: string;
  score: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ProjectData {
  id: string;
  name: string;
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  windows?: WindowItem[];
  createdAt: string;
  updatedAt: string;
}

export type EditorTool = 'select' | 'room' | 'door' | 'window' | 'delete';

export interface DetectedRoom {
  name: string;
  width: number;
  height: number;
  color: string;
}

export interface FurnitureVariant {
  variantLabel: string;
  width: number;
  height: number;
}

export interface FurnitureCatalogItem {
  type: string;
  label: string;
  width: number;
  height: number;
  category: string;
  variants?: FurnitureVariant[];
}

export const DOOR_PRESETS = [
  { label: 'Standard Door', width: 40, height: 8 },
  { label: 'Double Door', width: 60, height: 8 },
  { label: 'Sliding Door', width: 50, height: 6 },
] as const;

export const WINDOW_PRESETS = [
  { label: 'Standard Window', width: 40, height: 6 },
  { label: 'Bay Window', width: 60, height: 10 },
  { label: 'Skylight', width: 30, height: 30 },
  { label: 'Casement Window', width: 35, height: 6 },
] as const;

export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  {
    type: 'sofa', label: 'Sofa', width: 100, height: 45, category: 'Living',
    variants: [
      { variantLabel: '3-Seater', width: 120, height: 45 },
      { variantLabel: '2-Seater', width: 80, height: 42 },
      { variantLabel: 'L-Shape', width: 130, height: 100 },
      { variantLabel: 'Corner Sofa', width: 110, height: 110 },
    ],
  },
  {
    type: 'armchair', label: 'Armchair', width: 40, height: 40, category: 'Living',
    variants: [
      { variantLabel: 'Standard', width: 40, height: 40 },
      { variantLabel: 'Recliner', width: 45, height: 50 },
      { variantLabel: 'Accent Chair', width: 38, height: 38 },
    ],
  },
  { type: 'coffee-table', label: 'Coffee Table', width: 60, height: 35, category: 'Living' },
  { type: 'tv-unit', label: 'TV Unit', width: 80, height: 25, category: 'Living' },
  { type: 'bookshelf', label: 'Bookshelf', width: 60, height: 20, category: 'Living' },
  {
    type: 'bed-double', label: 'Double Bed', width: 80, height: 100, category: 'Bedroom',
    variants: [
      { variantLabel: 'Queen', width: 80, height: 100 },
      { variantLabel: 'King', width: 100, height: 105 },
    ],
  },
  {
    type: 'bed-single', label: 'Single Bed', width: 50, height: 100, category: 'Bedroom',
    variants: [
      { variantLabel: 'Standard', width: 50, height: 100 },
      { variantLabel: 'Twin XL', width: 50, height: 110 },
    ],
  },
  { type: 'wardrobe', label: 'Wardrobe', width: 60, height: 30, category: 'Bedroom' },
  { type: 'nightstand', label: 'Nightstand', width: 25, height: 25, category: 'Bedroom' },
  { type: 'dresser', label: 'Dresser', width: 50, height: 25, category: 'Bedroom' },
  {
    type: 'dining-table', label: 'Dining Table', width: 80, height: 50, category: 'Dining',
    variants: [
      { variantLabel: '4-Seater', width: 80, height: 50 },
      { variantLabel: '6-Seater', width: 110, height: 55 },
      { variantLabel: 'Round', width: 60, height: 60 },
    ],
  },
  { type: 'chair', label: 'Chair', width: 22, height: 22, category: 'Dining' },
  { type: 'kitchen-counter', label: 'Counter', width: 100, height: 30, category: 'Kitchen' },
  { type: 'stove', label: 'Stove', width: 35, height: 30, category: 'Kitchen' },
  { type: 'fridge', label: 'Fridge', width: 35, height: 35, category: 'Kitchen' },
  { type: 'sink', label: 'Sink', width: 30, height: 25, category: 'Kitchen' },
  { type: 'bathtub', label: 'Bathtub', width: 80, height: 40, category: 'Bathroom' },
  { type: 'toilet', label: 'Toilet', width: 25, height: 30, category: 'Bathroom' },
  { type: 'basin', label: 'Basin', width: 30, height: 20, category: 'Bathroom' },
  { type: 'desk', label: 'Desk', width: 70, height: 35, category: 'Office' },
  { type: 'office-chair', label: 'Office Chair', width: 28, height: 28, category: 'Office' },
];

export const ROOM_PRESETS = [
  { name: 'Living Room', width: 250, height: 200, color: 'hsl(140 30% 90%)' },
  { name: 'Bedroom', width: 200, height: 180, color: 'hsl(200 30% 89%)' },
  { name: 'Kitchen', width: 180, height: 150, color: 'hsl(38 40% 88%)' },
  { name: 'Bathroom', width: 120, height: 100, color: 'hsl(199 40% 86%)' },
  { name: 'Dining Room', width: 180, height: 160, color: 'hsl(25 35% 89%)' },
  { name: 'Office', width: 160, height: 140, color: 'hsl(170 25% 87%)' },
  { name: 'Hallway', width: 200, height: 60, color: 'hsl(40 30% 88%)' },
  { name: 'Open Area', width: 220, height: 200, color: 'hsl(120 20% 91%)' },
  { name: 'Staircase', width: 80, height: 150, color: 'hsl(30 25% 82%)' },
] as const;

export interface PresetLayout {
  name: string;
  roomCount: number;
  description: string;
  rooms: { name: string; x: number; y: number; width: number; height: number; color: string }[];
  doors: { x: number; y: number; width: number; height: number; rotation: number }[];
  furniture: { type: string; label: string; x: number; y: number; width: number; height: number }[];
}

export const PRESET_LAYOUTS: PresetLayout[] = [
  {
    name: 'Studio',
    roomCount: 1,
    description: 'A single open-plan living space',
    rooms: [
      { name: 'Studio', x: 50, y: 50, width: 350, height: 280, color: 'hsl(140 30% 90%)' },
    ],
    doors: [
      { x: 50, y: 285, width: 40, height: 8, rotation: 0 },
    ],
    furniture: [
      { type: 'bed-single', label: 'Bed', x: 300, y: 60, width: 50, height: 100 },
      { type: 'sofa', label: 'Sofa', x: 80, y: 80, width: 100, height: 45 },
      { type: 'desk', label: 'Desk', x: 80, y: 220, width: 70, height: 35 },
    ],
  },
  {
    name: '2-Room Apartment',
    roomCount: 2,
    description: 'Living room + bedroom layout',
    rooms: [
      { name: 'Living Room', x: 50, y: 50, width: 250, height: 200, color: 'hsl(140 30% 90%)' },
      { name: 'Bedroom', x: 310, y: 50, width: 200, height: 200, color: 'hsl(200 30% 89%)' },
    ],
    doors: [
      { x: 50, y: 205, width: 40, height: 8, rotation: 0 },
      { x: 300, y: 130, width: 40, height: 8, rotation: 90 },
    ],
    furniture: [
      { type: 'sofa', label: 'Sofa', x: 80, y: 80, width: 120, height: 45 },
      { type: 'tv-unit', label: 'TV Unit', x: 80, y: 180, width: 80, height: 25 },
      { type: 'bed-double', label: 'Double Bed', x: 350, y: 80, width: 80, height: 100 },
      { type: 'wardrobe', label: 'Wardrobe', x: 320, y: 200, width: 60, height: 30 },
    ],
  },
  {
    name: '3-Room Home',
    roomCount: 3,
    description: 'Living, bedroom, and kitchen',
    rooms: [
      { name: 'Living Room', x: 50, y: 50, width: 250, height: 200, color: 'hsl(140 30% 90%)' },
      { name: 'Bedroom', x: 310, y: 50, width: 200, height: 200, color: 'hsl(200 30% 89%)' },
      { name: 'Kitchen', x: 50, y: 260, width: 180, height: 150, color: 'hsl(38 40% 88%)' },
    ],
    doors: [
      { x: 50, y: 205, width: 40, height: 8, rotation: 0 },
      { x: 300, y: 130, width: 40, height: 8, rotation: 90 },
      { x: 130, y: 255, width: 40, height: 8, rotation: 0 },
    ],
    furniture: [
      { type: 'sofa', label: 'Sofa', x: 80, y: 80, width: 120, height: 45 },
      { type: 'bed-double', label: 'Double Bed', x: 350, y: 80, width: 80, height: 100 },
      { type: 'kitchen-counter', label: 'Counter', x: 60, y: 310, width: 100, height: 30 },
      { type: 'stove', label: 'Stove', x: 170, y: 310, width: 35, height: 30 },
    ],
  },
];
