import { useState } from 'react';
import { FURNITURE_CATALOG, ROOM_PRESETS, DOOR_PRESETS, WINDOW_PRESETS, PRESET_LAYOUTS } from '@/types/editor';
import type { FurnitureCatalogItem, PresetLayout } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Sofa, BedDouble, UtensilsCrossed, Bath, Briefcase, LayoutGrid, ChevronDown, ChevronRight, RotateCw, Trash2, DoorOpen, Square, Layers } from 'lucide-react';

interface Props {
  onAddFurniture: (type: string, label: string, width: number, height: number, variant?: string) => void;
  onAddRoom: (name: string, width: number, height: number, color: string) => void;
  onAddDoor: (label: string, width: number, height: number) => void;
  onAddWindow: (label: string, width: number, height: number) => void;
  onLoadPreset: (preset: PresetLayout) => void;
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

export default function FurniturePanel({ onAddFurniture, onAddRoom, onAddDoor, onAddWindow, onLoadPreset, onRotateSelected, onDeleteSelected, hasSelection }: Props) {
  const [expandedCat, setExpandedCat] = useState<string>('Living');
  const [activeTab, setActiveTab] = useState<'rooms' | 'furniture' | 'doors' | 'windows' | 'presets'>('rooms');
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  const categories = [...new Set(FURNITURE_CATALOG.map(f => f.category))];

  const handleFurnitureClick = (item: FurnitureCatalogItem) => {
    if (item.variants && item.variants.length > 0) {
      setExpandedVariant(expandedVariant === item.type ? null : item.type);
    } else {
      onAddFurniture(item.type, item.label, item.width, item.height);
    }
  };

  const tabs: { key: typeof activeTab; label: string; icon: any }[] = [
    { key: 'rooms', label: 'Rooms', icon: LayoutGrid },
    { key: 'doors', label: 'Doors', icon: DoorOpen },
    { key: 'windows', label: 'Win', icon: Square },
    { key: 'furniture', label: 'Furn', icon: Sofa },
    { key: 'presets', label: 'Presets', icon: Layers },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 glass-card overflow-hidden flex flex-col h-full">
      <div className="p-2 border-b flex gap-0.5 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <Button
              key={t.key}
              variant={activeTab === t.key ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 text-[10px] px-1.5 whitespace-nowrap"
              onClick={() => setActiveTab(t.key)}
            >
              <Icon className="w-3 h-3 mr-0.5" /> {t.label}
            </Button>
          );
        })}
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

        {activeTab === 'windows' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1 mb-2">Click to add a window to the canvas</p>
            {WINDOW_PRESETS.map(preset => (
              <button
                key={preset.label}
                className="w-full text-left p-3 rounded-xl border hover:bg-muted/50 hover:border-secondary transition-colors"
                onClick={() => onAddWindow(preset.label, preset.width, preset.height)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Square className="w-4 h-4 text-blue-500" />
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
                        <div key={item.type}>
                          <button
                            className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                            onClick={() => handleFurnitureClick(item)}
                          >
                            <span className="flex items-center gap-1">
                              {item.label}
                              {item.variants && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/15 text-secondary font-medium">
                                  {item.variants.length}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {(item.width / 50 * 1.5).toFixed(1)}×{(item.height / 50 * 1.5).toFixed(1)}m
                            </span>
                          </button>
                          {item.variants && expandedVariant === item.type && (
                            <div className="ml-3 mb-1 space-y-0.5 border-l-2 border-secondary/20 pl-2">
                              {item.variants.map(v => (
                                <button
                                  key={v.variantLabel}
                                  className="w-full text-left p-1.5 rounded-lg text-xs hover:bg-secondary/10 transition-colors flex items-center justify-between"
                                  onClick={() => onAddFurniture(item.type, `${item.label} (${v.variantLabel})`, v.width, v.height, v.variantLabel)}
                                >
                                  <span className="text-secondary font-medium">{v.variantLabel}</span>
                                  <span className="text-muted-foreground">
                                    {(v.width / 50 * 1.5).toFixed(1)}×{(v.height / 50 * 1.5).toFixed(1)}m
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground px-1 mb-2">One-click layouts with rooms, doors & furniture</p>
            {PRESET_LAYOUTS.map(preset => (
              <button
                key={preset.name}
                className="w-full text-left p-4 rounded-xl border hover:bg-muted/50 hover:border-secondary transition-colors group"
                onClick={() => onLoadPreset(preset)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    {preset.roomCount}R
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{preset.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
                    <div className="flex gap-2 mt-1.5 text-[10px] text-muted-foreground">
                      <span>{preset.rooms.length} rooms</span>
                      <span>·</span>
                      <span>{preset.doors.length} doors</span>
                      <span>·</span>
                      <span>{preset.furniture.length} items</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
