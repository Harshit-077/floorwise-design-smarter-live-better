import { useState, useEffect } from 'react';
import { Ruler, RotateCw, Trash2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Room, FurnitureItem, DoorItem, WindowItem } from '@/types/editor';

interface Props {
  selectedId: string | null;
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  windows: WindowItem[];
  onResizeRoom: (id: string, width: number, height: number) => void;
  onResizeFurniture: (id: string, width: number, height: number) => void;
  onResizeDoor: (id: string, width: number, height: number) => void;
  onResizeWindow: (id: string, width: number, height: number) => void;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
}

function toMeters(px: number) { return (px / 50 * 1.5).toFixed(2); }
function fromMeters(m: string) { return Math.round((parseFloat(m) / 1.5) * 50); }

export default function PropertiesPanel({
  selectedId, rooms, furniture, doors, windows,
  onResizeRoom, onResizeFurniture, onResizeDoor, onResizeWindow,
  onRotateSelected, onDeleteSelected,
}: Props) {
  const room = rooms.find(r => r.id === selectedId);
  const furn = furniture.find(f => f.id === selectedId);
  const door = doors.find(d => d.id === selectedId);
  const win = windows.find(w => w.id === selectedId);
  const item = room || furn || door || win;

  const [widthM, setWidthM] = useState('');
  const [heightM, setHeightM] = useState('');

  useEffect(() => {
    if (item) {
      setWidthM(toMeters(item.width));
      setHeightM(toMeters(item.height));
    }
  }, [item?.id, item?.width, item?.height]);

  if (!item || !selectedId) {
    return (
      <div className="w-full p-4 glass-card rounded-xl">
        <div className="text-center text-sm text-muted-foreground py-6">
          <Move className="w-8 h-8 mx-auto mb-2 opacity-40" />
          Select an item to view properties
        </div>
      </div>
    );
  }

  const itemType = room ? 'Room' : furn ? 'Furniture' : win ? 'Window' : 'Door';
  const itemName = room ? room.name : furn ? furn.label : win ? 'Window' : 'Door';
  const rotation = furn ? furn.rotation : door ? door.rotation : win ? win.rotation : 0;

  const applySize = () => {
    const w = fromMeters(widthM);
    const h = fromMeters(heightM);
    if (isNaN(w) || isNaN(h) || w < 10 || h < 10) return;
    if (room) onResizeRoom(selectedId, w, h);
    else if (furn) onResizeFurniture(selectedId, w, h);
    else if (door) onResizeDoor(selectedId, w, h);
    else if (win) onResizeWindow(selectedId, w, h);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applySize();
  };

  const area = (parseFloat(widthM) * parseFloat(heightM)).toFixed(2);

  return (
    <div className="w-full glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-display font-bold">{itemName}</div>
            <div className="text-xs text-muted-foreground">{itemType}</div>
          </div>
          {room && (
            <div className="w-6 h-6 rounded-md border" style={{ background: room.color }} />
          )}
        </div>
      </div>

      {/* Dimensions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Ruler className="w-3.5 h-3.5" />
          <span className="font-medium">Dimensions (meters)</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Width</label>
            <input
              type="number"
              step="0.1"
              min="0.3"
              value={widthM}
              onChange={e => setWidthM(e.target.value)}
              onBlur={applySize}
              onKeyDown={handleKeyDown}
              className="w-full mt-1 px-2.5 py-1.5 bg-muted rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Height</label>
            <input
              type="number"
              step="0.1"
              min="0.3"
              value={heightM}
              onChange={e => setHeightM(e.target.value)}
              onBlur={applySize}
              onKeyDown={handleKeyDown}
              className="w-full mt-1 px-2.5 py-1.5 bg-muted rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-muted-foreground">Area</span>
          <span className="font-mono font-medium">{area} m²</span>
        </div>

        {(furn || door || win) && (
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-muted-foreground">Rotation</span>
            <span className="font-mono font-medium">{rotation}°</span>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {(furn || door || win) && (
            <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={onRotateSelected}>
              <RotateCw className="w-3 h-3" /> Rotate
            </Button>
          )}
          <Button variant="destructive" size="sm" className="flex-1 text-xs gap-1" onClick={onDeleteSelected}>
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
