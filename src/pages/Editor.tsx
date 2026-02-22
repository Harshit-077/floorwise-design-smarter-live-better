import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MousePointer, Square, Trash2, BarChart3, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import FurniturePanel from '@/components/FurniturePanel';
import AnalysisPanel from '@/components/AnalysisPanel';
import type { Room, FurnitureItem, EditorTool } from '@/types/editor';

const toolItems: { tool: EditorTool; icon: any; label: string }[] = [
  { tool: 'select', icon: MousePointer, label: 'Select & Move' },
  { tool: 'room', icon: Square, label: 'Add Room' },
  { tool: 'delete', icon: Trash2, label: 'Delete' },
];

export default function EditorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>('select');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [history, setHistory] = useState<{ rooms: Room[]; furniture: FurnitureItem[] }[]>([]);

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-19), { rooms: [...rooms], furniture: [...furniture] }]);
  }, [rooms, furniture]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRooms(prev.rooms);
    setFurniture(prev.furniture);
    setHistory(h => h.slice(0, -1));
    setSelectedId(null);
  }, [history]);

  const addRoom = useCallback((name: string, width: number, height: number, color: string) => {
    saveHistory();
    const offsetX = (rooms.length % 3) * 30;
    const offsetY = Math.floor(rooms.length / 3) * 30;
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      x: 50 + offsetX,
      y: 50 + offsetY,
      width, height, name, color,
    };
    setRooms(prev => [...prev, newRoom]);
    setSelectedId(newRoom.id);
    setActiveTool('select');
  }, [rooms.length, saveHistory]);

  const addFurniture = useCallback((type: string, label: string, width: number, height: number) => {
    saveHistory();
    const item: FurnitureItem = {
      id: `furn-${Date.now()}`,
      type, label, x: 400 + Math.random() * 100, y: 250 + Math.random() * 100,
      width, height, rotation: 0,
    };
    setFurniture(prev => [...prev, item]);
    setSelectedId(item.id);
    setActiveTool('select');
  }, [saveHistory]);

  const moveFurniture = useCallback((id: string, x: number, y: number) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  }, []);

  const moveRoom = useCallback((id: string, x: number, y: number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, x, y } : r));
  }, []);

  const deleteItem = useCallback((id: string) => {
    saveHistory();
    setRooms(prev => prev.filter(r => r.id !== id));
    setFurniture(prev => prev.filter(f => f.id !== id));
    setSelectedId(null);
  }, [saveHistory]);

  const rotateSelected = useCallback(() => {
    if (!selectedId) return;
    saveHistory();
    setFurniture(prev => prev.map(f =>
      f.id === selectedId ? { ...f, rotation: (f.rotation + 90) % 360 } : f
    ));
  }, [selectedId, saveHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    deleteItem(selectedId);
  }, [selectedId, deleteItem]);

  return (
    <div className="h-screen pt-16 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b bg-card flex items-center px-4 gap-2 flex-shrink-0">
        {toolItems.map(({ tool, icon: Icon, label }) => (
          <Button
            key={tool}
            variant={activeTool === tool ? 'default' : 'ghost'}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setActiveTool(tool)}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={undo} disabled={history.length === 0}>
          <Undo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Undo</span>
        </Button>

        <div className="flex-1" />

        <div className="text-xs text-muted-foreground mr-2">
          {rooms.length} rooms · {furniture.length} items
        </div>

        <Button
          variant={showAnalysis ? 'default' : 'hero'}
          size="sm"
          className="gap-1.5"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Analyze Layout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <FurniturePanel
          onAddFurniture={addFurniture}
          onAddRoom={addRoom}
          onRotateSelected={rotateSelected}
          onDeleteSelected={deleteSelected}
          hasSelection={!!selectedId}
        />

        <div className="flex-1 p-3 overflow-hidden">
          <FloorPlanCanvas
            rooms={rooms}
            furniture={furniture}
            selectedId={selectedId}
            activeTool={activeTool}
            onSelectItem={setSelectedId}
            onMoveFurniture={moveFurniture}
            onMoveRoom={moveRoom}
            onDeleteItem={deleteItem}
          />
        </div>

        <AnimatePresence>
          {showAnalysis && (
            <AnalysisPanel
              rooms={rooms}
              furniture={furniture}
              onClose={() => setShowAnalysis(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
