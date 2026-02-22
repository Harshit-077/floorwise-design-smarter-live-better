export interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
}

export interface FurnitureItem {
  id: string;
  type: string;
  label: string;
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
  createdAt: string;
  updatedAt: string;
}

export type EditorTool = 'select' | 'room' | 'door' | 'window' | 'delete';

export const FURNITURE_CATALOG = [
  { type: 'sofa', label: 'Sofa', width: 100, height: 45, category: 'Living' },
  { type: 'armchair', label: 'Armchair', width: 40, height: 40, category: 'Living' },
  { type: 'coffee-table', label: 'Coffee Table', width: 60, height: 35, category: 'Living' },
  { type: 'tv-unit', label: 'TV Unit', width: 80, height: 25, category: 'Living' },
  { type: 'bookshelf', label: 'Bookshelf', width: 60, height: 20, category: 'Living' },
  { type: 'bed-double', label: 'Double Bed', width: 80, height: 100, category: 'Bedroom' },
  { type: 'bed-single', label: 'Single Bed', width: 50, height: 100, category: 'Bedroom' },
  { type: 'wardrobe', label: 'Wardrobe', width: 60, height: 30, category: 'Bedroom' },
  { type: 'nightstand', label: 'Nightstand', width: 25, height: 25, category: 'Bedroom' },
  { type: 'dresser', label: 'Dresser', width: 50, height: 25, category: 'Bedroom' },
  { type: 'dining-table', label: 'Dining Table', width: 80, height: 50, category: 'Dining' },
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
] as const;

export const ROOM_PRESETS = [
  { name: 'Living Room', width: 250, height: 200, color: 'hsl(197 33% 91%)' },
  { name: 'Bedroom', width: 200, height: 180, color: 'hsl(220 30% 92%)' },
  { name: 'Kitchen', width: 180, height: 150, color: 'hsl(27 40% 92%)' },
  { name: 'Bathroom', width: 120, height: 100, color: 'hsl(195 30% 90%)' },
  { name: 'Dining Room', width: 180, height: 160, color: 'hsl(128 20% 92%)' },
  { name: 'Office', width: 160, height: 140, color: 'hsl(260 20% 92%)' },
] as const;
