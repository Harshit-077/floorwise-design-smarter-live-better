import { useState } from 'react';
import { FURNITURE_CATALOG, ROOM_PRESETS, DOOR_PRESETS } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Sofa, BedDouble, UtensilsCrossed, Bath, Briefcase, LayoutGrid, ChevronDown, ChevronRight, RotateCw, Trash2, DoorOpen } from 'lucide-react';

interface Props {
  onAddFurniture: (type: string, label: string, width: number, height: number) => void;
  onAddRoom: (name: string, width: number, height: number, color: string) => void;
  onAddDoor: (label: string, width: number, height: number) => void;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
}

const categoryIcons: Record<string, any> = {
  Living: Sofa,
  Bedroom: BedDouble,
  Dining: UtensilsCrossed,
  Kitchen: UtensilsCrossed,
  Bathroom: Bath,
  Office: Briefcase,
};

export default function FurniturePanel({ onAddFurniture, onAddRoom, onAddDoor, onRotateSelected, onDeleteSelected, hasSelection }: Props) {
  const [expandedCat, setExpandedCat] = useState<string>('Living');
  const [activeTab, setActiveTab] = useState<'rooms' | 'furniture' | 'doors'>('rooms');

  const categories = [...new Set(FURNITURE_CATALOG.map(f => f.category))];

  return (
    <div className="w-full md:w-64 flex-shrink-0 glass-card overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b flex gap-1 overflow-x-auto">
        <Button variant={activeTab === 'rooms' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs whitespace-nowrap" onClick={() => setActiveTab('rooms')}>
          <LayoutGrid className="w-3 h-3 mr-1" /> Rooms
        </Button>
        <Button variant={activeTab === 'doors' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs whitespace-nowrap" onClick={() => setActiveTab('doors')}>
          <DoorOpen className="w-3 h-3 mr-1" /> Doors
        </Button>
        <Button variant={activeTab === 'furniture' ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs whitespace-nowrap" onClick={() => setActiveTab('furniture')}>
          <Sofa className="w-3 h-3 mr-1" /> Furniture
        </Button>
      </div>

      {hasSelection && (
        <div className="p-2 border-b flex gap-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={onRotateSelected}>
            <RotateCw className="w-3 h-3 mr-1" /> Rotate
          </Button>
          <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={onDeleteSelected}>
            <Trash2 className="w-3 h-3 mr-1" /> Delete
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'rooms' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1 mb-2">Click to add a room to the canvas</p>
            {ROOM_PRESETS.map(preset => (
              <button
                key={preset.name}
                className="w-full text-left p-3 rounded-xl border hover:bg-muted/50 hover:border-secondary transition-colors"
                onClick={() => onAddRoom(preset.name, preset.width, preset.height, preset.color)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: preset.color }}>
                    <LayoutGrid className="w-4 h-4 text-foreground/50" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(preset.width / 50 * 1.5).toFixed(1)}m × {(preset.height / 50 * 1.5).toFixed(1)}m
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'doors' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1 mb-2">Click to add a door to the canvas</p>
            {DOOR_PRESETS.map(preset => (
              <button
                key={preset.label}
                className="w-full text-left p-3 rounded-xl border hover:bg-muted/50 hover:border-secondary transition-colors"
                onClick={() => onAddDoor(preset.label, preset.width, preset.height)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <DoorOpen className="w-4 h-4 text-foreground/50" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{preset.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {(preset.width / 50 * 1.5).toFixed(1)}m × {(preset.height / 50 * 1.5).toFixed(1)}m
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'furniture' && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-1 mb-2">Click to add furniture to the canvas</p>
            {categories.map(cat => {
              const Icon = categoryIcons[cat] || Sofa;
              const items = FURNITURE_CATALOG.filter(f => f.category === cat);
              const isExpanded = expandedCat === cat;
              return (
                <div key={cat}>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCat(isExpanded ? '' : cat)}
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <Icon className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">{cat}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{items.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 space-y-0.5 mb-1">
                      {items.map(item => (
                        <button
                          key={item.type}
                          className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                          onClick={() => onAddFurniture(item.type, item.label, item.width, item.height)}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {(item.width / 50 * 1.5).toFixed(1)}×{(item.height / 50 * 1.5).toFixed(1)}m
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
