import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MousePointer, Square, Trash2, BarChart3, Undo2, Upload, ScanLine, DoorOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import FurniturePanel from '@/components/FurniturePanel';
import AnalysisPanel from '@/components/AnalysisPanel';
import ImageUploadModal from '@/components/ImageUploadModal';
import SpaceScanModal from '@/components/SpaceScanModal';
import type { Room, FurnitureItem, DoorItem, EditorTool } from '@/types/editor';

const toolItems: { tool: EditorTool; icon: any; label: string }[] = [
  { tool: 'select', icon: MousePointer, label: 'Select' },
  { tool: 'room', icon: Square, label: 'Room' },
  { tool: 'door', icon: DoorOpen, label: 'Door' },
  { tool: 'delete', icon: Trash2, label: 'Delete' },
];

export default function EditorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [doors, setDoors] = useState<DoorItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>('select');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ rooms: Room[]; furniture: FurnitureItem[]; doors: DoorItem[] }[]>([]);

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-19), { rooms: [...rooms], furniture: [...furniture], doors: [...doors] }]);
  }, [rooms, furniture, doors]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRooms(prev.rooms);
    setFurniture(prev.furniture);
    setDoors(prev.doors);
    setHistory(h => h.slice(0, -1));
    setSelectedId(null);
  }, [history]);

  const addRoom = useCallback((name: string, width: number, height: number, color: string) => {
    saveHistory();
    const offsetX = (rooms.length % 3) * 30;
    const offsetY = Math.floor(rooms.length / 3) * 30;
    const newRoom: Room = { id: `room-${Date.now()}`, x: 50 + offsetX, y: 50 + offsetY, width, height, name, color };
    setRooms(prev => [...prev, newRoom]);
    setSelectedId(newRoom.id);
    setActiveTool('select');
  }, [rooms.length, saveHistory]);

  const addFurniture = useCallback((type: string, label: string, width: number, height: number) => {
    saveHistory();
    const item: FurnitureItem = { id: `furn-${Date.now()}`, type, label, x: 400 + Math.random() * 100, y: 250 + Math.random() * 100, width, height, rotation: 0 };
    setFurniture(prev => [...prev, item]);
    setSelectedId(item.id);
    setActiveTool('select');
  }, [saveHistory]);

  const addDoor = useCallback((label: string, width: number, height: number) => {
    saveHistory();
    const door: DoorItem = { id: `door-${Date.now()}`, x: 300 + Math.random() * 100, y: 200 + Math.random() * 100, width, height, rotation: 0, wallSide: 'bottom' };
    setDoors(prev => [...prev, door]);
    setSelectedId(door.id);
    setActiveTool('select');
  }, [saveHistory]);

  const moveFurniture = useCallback((id: string, x: number, y: number) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  }, []);

  const moveRoom = useCallback((id: string, x: number, y: number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, x, y } : r));
  }, []);

  const resizeRoom = useCallback((id: string, width: number, height: number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, width, height } : r));
  }, []);

  const moveDoor = useCallback((id: string, x: number, y: number) => {
    setDoors(prev => prev.map(d => d.id === id ? { ...d, x, y } : d));
  }, []);

  const deleteItem = useCallback((id: string) => {
    saveHistory();
    setRooms(prev => prev.filter(r => r.id !== id));
    setFurniture(prev => prev.filter(f => f.id !== id));
    setDoors(prev => prev.filter(d => d.id !== id));
    setSelectedId(null);
  }, [saveHistory]);

  const rotateSelected = useCallback(() => {
    if (!selectedId) return;
    saveHistory();
    setFurniture(prev => prev.map(f => f.id === selectedId ? { ...f, rotation: (f.rotation + 90) % 360 } : f));
    setDoors(prev => prev.map(d => d.id === selectedId ? { ...d, rotation: (d.rotation + 90) % 360 } : d));
  }, [selectedId, saveHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    deleteItem(selectedId);
  }, [selectedId, deleteItem]);

  return (
    <div className="h-screen pt-16 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b bg-card flex items-center px-2 md:px-4 gap-1 md:gap-2 flex-shrink-0 overflow-x-auto">
        {/* Mobile panel toggle */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowPanel(!showPanel)}>
          {showPanel ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {toolItems.map(({ tool, icon: Icon, label }) => (
          <Button
            key={tool}
            variant={activeTool === tool ? 'default' : 'ghost'}
            size="sm"
            className="gap-1 text-xs px-2 md:px-3"
            onClick={() => setActiveTool(tool)}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-0.5 md:mx-1" />

        <Button variant="ghost" size="sm" className="gap-1 text-xs px-2" onClick={() => setShowUpload(true)}>
          <Upload className="w-3.5 h-3.5" /> <span className="hidden md:inline">Upload</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-xs px-2" onClick={() => setShowScan(true)}>
          <ScanLine className="w-3.5 h-3.5" /> <span className="hidden md:inline">Scan</span>
        </Button>

        <div className="w-px h-6 bg-border mx-0.5 md:mx-1" />

        <Button variant="ghost" size="sm" className="gap-1 text-xs px-2" onClick={undo} disabled={history.length === 0}>
          <Undo2 className="w-3.5 h-3.5" /> <span className="hidden md:inline">Undo</span>
        </Button>

        {backgroundImage && (
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-destructive px-2" onClick={() => setBackgroundImage(null)}>
            <span className="hidden sm:inline">Clear BG</span>
          </Button>
        )}

        <div className="flex-1" />

        <div className="text-xs text-muted-foreground mr-1 md:mr-2 hidden sm:block">
          {rooms.length}R · {doors.length}D · {furniture.length}F
        </div>

        <Button
          variant={showAnalysis ? 'default' : 'hero'}
          size="sm"
          className="gap-1 text-xs md:text-sm"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          <BarChart3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Analyze</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Side panel - mobile overlay or desktop sidebar */}
        <div className={`${showPanel ? 'absolute inset-0 z-30 bg-background/80 backdrop-blur-sm md:relative md:bg-transparent md:backdrop-blur-none' : 'hidden md:block'}`}>
          <div className={`${showPanel ? 'w-64 h-full' : 'w-64'}`}>
            <FurniturePanel
              onAddFurniture={(type, label, w, h) => { addFurniture(type, label, w, h); setShowPanel(false); }}
              onAddRoom={(name, w, h, c) => { addRoom(name, w, h, c); setShowPanel(false); }}
              onAddDoor={(label, w, h) => { addDoor(label, w, h); setShowPanel(false); }}
              onRotateSelected={rotateSelected}
              onDeleteSelected={deleteSelected}
              hasSelection={!!selectedId}
            />
          </div>
        </div>

        <div className="flex-1 p-2 md:p-3 overflow-hidden">
          <FloorPlanCanvas
            rooms={rooms}
            furniture={furniture}
            doors={doors}
            selectedId={selectedId}
            activeTool={activeTool}
            onSelectItem={setSelectedId}
            onMoveFurniture={moveFurniture}
            onMoveRoom={moveRoom}
            onResizeRoom={resizeRoom}
            onMoveDoor={moveDoor}
            onDeleteItem={deleteItem}
            backgroundImage={backgroundImage}
          />
        </div>

        <AnimatePresence>
          {showAnalysis && (
            <AnalysisPanel
              rooms={rooms}
              furniture={furniture}
              doors={doors}
              onClose={() => setShowAnalysis(false)}
            />
          )}
        </AnimatePresence>
      </div>

      <ImageUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onImageLoaded={setBackgroundImage} />
      <SpaceScanModal isOpen={showScan} onClose={() => setShowScan(false)} onScanComplete={setBackgroundImage} />
    </div>
  );
}
