import { useState } from 'react';
import { FURNITURE_CATALOG, ROOM_PRESETS, DOOR_PRESETS, WINDOW_PRESETS, PLOT_PRESETS } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Sofa, BedDouble, UtensilsCrossed, Bath, Briefcase, LayoutGrid, ChevronDown, ChevronRight, RotateCw, Trash2, DoorOpen, Plus, Sparkles, Car } from 'lucide-react';

interface Props {
  onAddFurniture: (type: string, label: string, width: number, height: number) => void;
  onAddRoom: (name: string, width: number, height: number, color: string) => void;
  onAddDoor: (label: string, width: number, height: number) => void;
  onAddWindow: (label: string, width: number, height: number) => void;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onGeneratePlotLayout?: (plotIndex: number) => void;
}

const categoryIcons: Record<string, any> = {
  Living: Sofa,
  Bedroom: BedDouble,
  Dining: UtensilsCrossed,
  Kitchen: UtensilsCrossed,
  Bathroom: Bath,
  Office: Briefcase,
  Exterior: Car,
};

export default function FurniturePanel({ onAddFurniture, onAddRoom, onAddDoor, onAddWindow, onRotateSelected, onDeleteSelected, hasSelection, onGeneratePlotLayout }: Props) {
  const [expandedCat, setExpandedCat] = useState<string>('Living');
  const [activeTab, setActiveTab] = useState<'rooms' | 'furniture' | 'doors' | 'windows'>('rooms');
  const [customRoomName, setCustomRoomName] = useState('Custom Room');
  const [customRoomW, setCustomRoomW] = useState('4.0');
  const [customRoomH, setCustomRoomH] = useState('3.5');
  const [showCustomRoom, setShowCustomRoom] = useState(false);
  const [showPlots, setShowPlots] = useState(false);

  const categories = [...new Set(FURNITURE_CATALOG.map(f => f.category))];

  const addCustomRoom = () => {
    const w = Math.round((parseFloat(customRoomW) / 1.5) * 50);
    const h = Math.round((parseFloat(customRoomH) / 1.5) * 50);
    if (isNaN(w) || isNaN(h) || w < 30 || h < 30) return;
    onAddRoom(customRoomName || 'Custom Room', w, h, 'hsl(0 0% 88%)');
    setShowCustomRoom(false);
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 glass-card overflow-hidden flex flex-col h-full">
      <div className="p-2 border-b flex flex-wrap gap-1">
        {(['rooms', 'doors', 'windows', 'furniture'] as const).map(tab => {
          const icons = { rooms: LayoutGrid, doors: DoorOpen, windows: LayoutGrid, furniture: Sofa };
          const Icon = icons[tab];
          return (
            <Button key={tab} variant={activeTab === tab ? 'default' : 'ghost'} size="sm" className="flex-1 text-xs whitespace-nowrap min-w-0 px-2" onClick={() => setActiveTab(tab)}>
              <Icon className="w-3 h-3 mr-1 flex-shrink-0" /> <span className="truncate capitalize">{tab}</span>
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
            
            {/* Plot Presets */}
            <button
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 border border-dashed border-secondary/40 transition-colors"
              onClick={() => setShowPlots(!showPlots)}
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Plot Presets (AI Layout)</span>
              {showPlots ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
            {showPlots && (
              <div className="space-y-1 ml-2">
                {PLOT_PRESETS.map((plot, i) => (
                  <button
                    key={plot.label}
                    className="w-full text-left p-2.5 rounded-lg border hover:bg-secondary/10 hover:border-secondary transition-colors"
                    onClick={() => onGeneratePlotLayout?.(i)}
                  >
                    <div className="text-sm font-medium">{plot.label}</div>
                    <div className="text-xs text-muted-foreground">{plot.widthFt}ft × {plot.depthFt}ft</div>
                  </button>
                ))}
              </div>
            )}

            {/* Room Presets */}
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

            {/* Custom Room */}
            <button
              className="w-full text-left p-3 rounded-xl border border-dashed hover:bg-muted/50 hover:border-primary transition-colors"
              onClick={() => setShowCustomRoom(!showCustomRoom)}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm font-medium">Custom Room</div>
              </div>
            </button>
            {showCustomRoom && (
              <div className="p-3 rounded-xl border bg-muted/30 space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Room Name</label>
                  <input
                    type="text"
                    value={customRoomName}
                    onChange={e => setCustomRoomName(e.target.value)}
                    placeholder="e.g. Store Room"
                    className="w-full mt-1 px-2.5 py-1.5 bg-background rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Width (m)</label>
                    <input type="number" step="0.1" min="0.5" value={customRoomW} onChange={e => setCustomRoomW(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-background rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-ring border" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Height (m)</label>
                    <input type="number" step="0.1" min="0.5" value={customRoomH} onChange={e => setCustomRoomH(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-background rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-ring border" />
                  </div>
                </div>
                <Button size="sm" className="w-full text-xs" onClick={addCustomRoom}>
                  <Plus className="w-3 h-3 mr-1" /> Add Custom Room
                </Button>
              </div>
            )}
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
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4 text-foreground/50" />
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
