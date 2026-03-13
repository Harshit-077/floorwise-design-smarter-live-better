import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MousePointer, Square, Trash2, BarChart3, Undo2, Upload, ScanLine, DoorOpen, Menu, X, Box, Save, SquareStack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import FurniturePanel from '@/components/FurniturePanel';
import PropertiesPanel from '@/components/PropertiesPanel';
import AnalysisPanel from '@/components/AnalysisPanel';
import ImageUploadModal from '@/components/ImageUploadModal';
import SpaceScanModal from '@/components/SpaceScanModal';
import ExportTools from '@/components/ExportTools';
import AIChatWidget from '@/components/AIChatWidget';
import type { Room, FurnitureItem, DoorItem, WindowItem, EditorTool, ProjectData } from '@/types/editor';
import { PLOT_PRESETS } from '@/types/editor';
import { toast } from 'sonner';

const ThreeDView = lazy(() => import('@/components/ThreeDView'));

const toolItems: { tool: EditorTool; icon: any; label: string }[] = [
  { tool: 'select', icon: MousePointer, label: 'Select' },
  { tool: 'room', icon: Square, label: 'Room' },
  { tool: 'door', icon: DoorOpen, label: 'Door' },
  { tool: 'window', icon: SquareStack, label: 'Window' },
  { tool: 'delete', icon: Trash2, label: 'Delete' },
];

export default function EditorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [doors, setDoors] = useState<DoorItem[]>([]);
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>('select');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ rooms: Room[]; furniture: FurnitureItem[]; doors: DoorItem[]; windows: WindowItem[] }[]>([]);

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-19), { rooms: [...rooms], furniture: [...furniture], doors: [...doors], windows: [...windows] }]);
  }, [rooms, furniture, doors, windows]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRooms(prev.rooms);
    setFurniture(prev.furniture);
    setDoors(prev.doors);
    setWindows(prev.windows);
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

  const addWindow = useCallback((label: string, width: number, height: number) => {
    saveHistory();
    const win: WindowItem = { id: `win-${Date.now()}`, x: 350 + Math.random() * 100, y: 150 + Math.random() * 100, width, height, rotation: 0 };
    setWindows(prev => [...prev, win]);
    setSelectedId(win.id);
    setActiveTool('select');
  }, [saveHistory]);

  const moveFurniture = useCallback((id: string, x: number, y: number) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  }, []);

  const moveRoom = useCallback((id: string, x: number, y: number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, x, y } : r));
  }, []);

  const resizeRoom = useCallback((id: string, width: number, height: number) => {
    saveHistory();
    setRooms(prev => prev.map(r => r.id === id ? { ...r, width, height } : r));
  }, [saveHistory]);

  const resizeFurniture = useCallback((id: string, width: number, height: number) => {
    saveHistory();
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, width, height } : f));
  }, [saveHistory]);

  const resizeDoor = useCallback((id: string, width: number, height: number) => {
    saveHistory();
    setDoors(prev => prev.map(d => d.id === id ? { ...d, width, height } : d));
  }, [saveHistory]);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    saveHistory();
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, [saveHistory]);

  const moveDoor = useCallback((id: string, x: number, y: number) => {
    setDoors(prev => prev.map(d => d.id === id ? { ...d, x, y } : d));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const deleteItem = useCallback((id: string) => {
    saveHistory();
    setRooms(prev => prev.filter(r => r.id !== id));
    setFurniture(prev => prev.filter(f => f.id !== id));
    setDoors(prev => prev.filter(d => d.id !== id));
    setWindows(prev => prev.filter(w => w.id !== id));
    setSelectedId(null);
  }, [saveHistory]);

  const rotateSelected = useCallback(() => {
    if (!selectedId) return;
    saveHistory();
    setFurniture(prev => prev.map(f => f.id === selectedId ? { ...f, rotation: (f.rotation + 90) % 360 } : f));
    setDoors(prev => prev.map(d => d.id === selectedId ? { ...d, rotation: (d.rotation + 90) % 360 } : d));
    setWindows(prev => prev.map(w => w.id === selectedId ? { ...w, rotation: (w.rotation + 90) % 360 } : w));
  }, [selectedId, saveHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    deleteItem(selectedId);
  }, [selectedId, deleteItem]);

  const renameRoom = useCallback((id: string, name: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, name } : r));
  }, []);

  const loadProject = useCallback((data: ProjectData) => {
    saveHistory();
    setRooms(data.rooms);
    setFurniture(data.furniture);
    setDoors(data.doors);
    setWindows(data.windows || []);
    setSelectedId(null);
  }, [saveHistory]);

  const generatePlotLayout = useCallback((plotIndex: number) => {
    const plot = PLOT_PRESETS[plotIndex];
    if (!plot) return;
    saveHistory();

    // Convert feet to px (1.5m per 50px, 1ft = 0.3048m)
    const ftToPx = (ft: number) => Math.round((ft * 0.3048 / 1.5) * 50);
    const plotWPx = ftToPx(plot.widthFt);
    const plotHPx = ftToPx(plot.depthFt);

    const newRooms: Room[] = [];
    const newDoors: DoorItem[] = [];
    const newWindows: WindowItem[] = [];
    const newFurniture: FurnitureItem[] = [];
    const ts = Date.now();

    if (plot.sqft <= 675) {
      // 3 Marla: 2 bed, 1 floor compact
      const margin = 10;
      newRooms.push(
        { id: `room-${ts}-1`, x: margin, y: margin, width: Math.round(plotWPx * 0.55), height: Math.round(plotHPx * 0.45), name: 'Living Room', color: 'hsl(0 0% 92%)' },
        { id: `room-${ts}-2`, x: margin, y: margin + Math.round(plotHPx * 0.47), width: Math.round(plotWPx * 0.55), height: Math.round(plotHPx * 0.25), name: 'Kitchen + Dining', color: 'hsl(0 0% 86%)' },
        { id: `room-${ts}-3`, x: margin + Math.round(plotWPx * 0.57), y: margin, width: Math.round(plotWPx * 0.42), height: Math.round(plotHPx * 0.48), name: 'Bedroom 1', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-4`, x: margin + Math.round(plotWPx * 0.57), y: margin + Math.round(plotHPx * 0.50), width: Math.round(plotWPx * 0.42), height: Math.round(plotHPx * 0.35), name: 'Bedroom 2', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-5`, x: margin, y: margin + Math.round(plotHPx * 0.74), width: Math.round(plotWPx * 0.35), height: Math.round(plotHPx * 0.24), name: 'Bathroom', color: 'hsl(0 0% 83%)' },
      );
    } else if (plot.sqft <= 1125) {
      // 5 Marla: 3 bed, possible 2-floor
      newRooms.push(
        { id: `room-${ts}-1`, x: 10, y: 10, width: Math.round(plotWPx * 0.6), height: Math.round(plotHPx * 0.35), name: 'Living Room', color: 'hsl(0 0% 92%)' },
        { id: `room-${ts}-2`, x: 10, y: 10 + Math.round(plotHPx * 0.37), width: Math.round(plotWPx * 0.4), height: Math.round(plotHPx * 0.28), name: 'Kitchen', color: 'hsl(0 0% 86%)' },
        { id: `room-${ts}-3`, x: 10 + Math.round(plotWPx * 0.42), y: 10 + Math.round(plotHPx * 0.37), width: Math.round(plotWPx * 0.56), height: Math.round(plotHPx * 0.28), name: 'Dining Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-4`, x: 10 + Math.round(plotWPx * 0.62), y: 10, width: Math.round(plotWPx * 0.36), height: Math.round(plotHPx * 0.35), name: 'Bedroom 1', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-5`, x: 10, y: 10 + Math.round(plotHPx * 0.67), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.31), name: 'Bedroom 2', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-6`, x: 10 + Math.round(plotWPx * 0.50), y: 10 + Math.round(plotHPx * 0.67), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.31), name: 'Bedroom 3', color: 'hsl(0 0% 89%)' },
      );
    } else if (plot.sqft <= 1575) {
      // 7 Marla
      newRooms.push(
        { id: `room-${ts}-1`, x: 10, y: 10, width: Math.round(plotWPx * 0.55), height: Math.round(plotHPx * 0.35), name: 'Drawing Room', color: 'hsl(0 0% 92%)' },
        { id: `room-${ts}-2`, x: 10 + Math.round(plotWPx * 0.57), y: 10, width: Math.round(plotWPx * 0.41), height: Math.round(plotHPx * 0.35), name: 'Bedroom 1', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-3`, x: 10, y: 10 + Math.round(plotHPx * 0.37), width: Math.round(plotWPx * 0.45), height: Math.round(plotHPx * 0.28), name: 'Kitchen', color: 'hsl(0 0% 86%)' },
        { id: `room-${ts}-4`, x: 10 + Math.round(plotWPx * 0.47), y: 10 + Math.round(plotHPx * 0.37), width: Math.round(plotWPx * 0.51), height: Math.round(plotHPx * 0.28), name: 'Dining Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-5`, x: 10, y: 10 + Math.round(plotHPx * 0.67), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.31), name: 'Bedroom 2', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-6`, x: 10 + Math.round(plotWPx * 0.50), y: 10 + Math.round(plotHPx * 0.67), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.31), name: 'Bedroom 3', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-7`, x: 10 + Math.round(plotWPx * 0.70), y: 10 + Math.round(plotHPx * 0.37), width: Math.round(plotWPx * 0.28), height: Math.round(plotHPx * 0.15), name: 'Bathroom', color: 'hsl(0 0% 83%)' },
      );
    } else if (plot.sqft <= 2250) {
      // 10 Marla
      newRooms.push(
        { id: `room-${ts}-1`, x: 10, y: 10, width: Math.round(plotWPx * 0.5), height: Math.round(plotHPx * 0.3), name: 'Drawing Room', color: 'hsl(0 0% 92%)' },
        { id: `room-${ts}-2`, x: 10 + Math.round(plotWPx * 0.52), y: 10, width: Math.round(plotWPx * 0.46), height: Math.round(plotHPx * 0.3), name: 'Living Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-3`, x: 10, y: 10 + Math.round(plotHPx * 0.32), width: Math.round(plotWPx * 0.35), height: Math.round(plotHPx * 0.25), name: 'Kitchen', color: 'hsl(0 0% 86%)' },
        { id: `room-${ts}-4`, x: 10 + Math.round(plotWPx * 0.37), y: 10 + Math.round(plotHPx * 0.32), width: Math.round(plotWPx * 0.35), height: Math.round(plotHPx * 0.25), name: 'Dining Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-5`, x: 10 + Math.round(plotWPx * 0.74), y: 10 + Math.round(plotHPx * 0.32), width: Math.round(plotWPx * 0.24), height: Math.round(plotHPx * 0.25), name: 'Staircase', color: 'hsl(0 0% 84%)' },
        { id: `room-${ts}-6`, x: 10, y: 10 + Math.round(plotHPx * 0.59), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.38), name: 'Master Bedroom', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-7`, x: 10 + Math.round(plotWPx * 0.50), y: 10 + Math.round(plotHPx * 0.59), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.38), name: 'Bedroom 2', color: 'hsl(0 0% 89%)' },
      );
    } else {
      // 1 Kanal
      newRooms.push(
        { id: `room-${ts}-1`, x: 10, y: 10, width: Math.round(plotWPx * 0.45), height: Math.round(plotHPx * 0.25), name: 'Drawing Room', color: 'hsl(0 0% 92%)' },
        { id: `room-${ts}-2`, x: 10 + Math.round(plotWPx * 0.47), y: 10, width: Math.round(plotWPx * 0.51), height: Math.round(plotHPx * 0.25), name: 'Living Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-3`, x: 10, y: 10 + Math.round(plotHPx * 0.27), width: Math.round(plotWPx * 0.3), height: Math.round(plotHPx * 0.2), name: 'Kitchen', color: 'hsl(0 0% 86%)' },
        { id: `room-${ts}-4`, x: 10 + Math.round(plotWPx * 0.32), y: 10 + Math.round(plotHPx * 0.27), width: Math.round(plotWPx * 0.35), height: Math.round(plotHPx * 0.2), name: 'Dining Room', color: 'hsl(0 0% 90%)' },
        { id: `room-${ts}-5`, x: 10 + Math.round(plotWPx * 0.69), y: 10 + Math.round(plotHPx * 0.27), width: Math.round(plotWPx * 0.29), height: Math.round(plotHPx * 0.2), name: 'Guest Room', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-6`, x: 10, y: 10 + Math.round(plotHPx * 0.49), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.24), name: 'Master Bedroom', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-7`, x: 10 + Math.round(plotWPx * 0.50), y: 10 + Math.round(plotHPx * 0.49), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.24), name: 'Bedroom 2', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-8`, x: 10, y: 10 + Math.round(plotHPx * 0.75), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.23), name: 'Bedroom 3', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-9`, x: 10 + Math.round(plotWPx * 0.50), y: 10 + Math.round(plotHPx * 0.75), width: Math.round(plotWPx * 0.48), height: Math.round(plotHPx * 0.23), name: 'Bedroom 4', color: 'hsl(0 0% 89%)' },
        { id: `room-${ts}-10`, x: 10 + Math.round(plotWPx * 0.80), y: 10 + Math.round(plotHPx * 0.49), width: Math.round(plotWPx * 0.18), height: Math.round(plotHPx * 0.15), name: 'Staircase', color: 'hsl(0 0% 84%)' },
      );
    }

    setRooms(newRooms);
    setFurniture(newFurniture);
    setDoors(newDoors);
    setWindows(newWindows);
    setSelectedId(null);
    setActiveTool('select');
    toast.success(`Generated ${plot.label} layout with ${newRooms.length} rooms. Customize rooms by renaming, resizing, and adding furniture.`);
  }, [saveHistory]);

  return (
    <div className="h-screen pt-16 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b bg-card flex items-center px-2 md:px-4 gap-1 md:gap-2 flex-shrink-0 overflow-x-auto">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowPanel(!showPanel)}>
          {showPanel ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {toolItems.map(({ tool, icon: Icon, label }) => (
          <Button key={tool} variant={activeTool === tool ? 'default' : 'ghost'} size="sm"
            className="gap-1 text-xs px-2 md:px-3" onClick={() => setActiveTool(tool)} title={label}>
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

        <Button variant="ghost" size="sm" className="gap-1 text-xs px-2" onClick={() => setShowExport(true)}>
          <Save className="w-3.5 h-3.5" /> <span className="hidden md:inline">Save</span>
        </Button>

        <Button variant={show3D ? 'default' : 'ghost'} size="sm" className="gap-1 text-xs px-2" onClick={() => setShow3D(!show3D)}>
          <Box className="w-3.5 h-3.5" /> <span className="hidden md:inline">3D</span>
        </Button>

        {backgroundImage && (
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-destructive px-2" onClick={() => setBackgroundImage(null)}>
            <span className="hidden sm:inline">Clear BG</span>
          </Button>
        )}

        <div className="flex-1" />

        <div className="text-xs text-muted-foreground mr-1 md:mr-2 hidden sm:block">
          {rooms.length}R · {doors.length}D · {windows.length}W · {furniture.length}F
        </div>

        <Button variant={showAnalysis ? 'default' : 'hero'} size="sm" className="gap-1 text-xs md:text-sm"
          onClick={() => setShowAnalysis(!showAnalysis)}>
          <BarChart3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Analyze</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className={`${showPanel ? 'absolute inset-0 z-30 bg-background/80 backdrop-blur-sm md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none' : 'hidden md:block'}`}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPanel(false); }}>
          <div className="w-72 md:w-64 h-full flex flex-col gap-2 overflow-y-auto p-2 bg-card md:bg-transparent shadow-xl md:shadow-none">
            <FurniturePanel
              onAddFurniture={(type, label, w, h) => { addFurniture(type, label, w, h); setShowPanel(false); }}
              onAddRoom={(name, w, h, c) => { addRoom(name, w, h, c); setShowPanel(false); }}
              onAddDoor={(label, w, h) => { addDoor(label, w, h); setShowPanel(false); }}
              onAddWindow={(label, w, h) => { addWindow(label, w, h); setShowPanel(false); }}
              onRotateSelected={rotateSelected}
              onDeleteSelected={deleteSelected}
              hasSelection={!!selectedId}
              onGeneratePlotLayout={generatePlotLayout}
            />
            <PropertiesPanel
              selectedId={selectedId}
              rooms={rooms} furniture={furniture} doors={doors} windows={windows}
              onResizeRoom={resizeRoom} onResizeFurniture={resizeFurniture} onResizeDoor={resizeDoor} onResizeWindow={resizeWindow}
              onRotateSelected={rotateSelected} onDeleteSelected={deleteSelected}
              onRenameRoom={renameRoom}
            />
          </div>
        </div>

        <div className="flex-1 p-2 md:p-3 overflow-hidden">
          {show3D ? (
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-card rounded-xl border"><span className="text-muted-foreground">Loading 3D view...</span></div>}>
              <ThreeDView rooms={rooms} furniture={furniture} doors={doors} windows={windows} />
            </Suspense>
          ) : (
            <FloorPlanCanvas
              rooms={rooms} furniture={furniture} doors={doors} windows={windows}
              selectedId={selectedId} activeTool={activeTool}
              onSelectItem={setSelectedId}
              onMoveFurniture={moveFurniture} onMoveRoom={moveRoom}
              onResizeRoom={resizeRoom} onResizeFurniture={resizeFurniture} onResizeDoor={resizeDoor} onResizeWindow={resizeWindow}
              onMoveDoor={moveDoor} onMoveWindow={moveWindow} onDeleteItem={deleteItem}
              backgroundImage={backgroundImage}
            />
          )}
        </div>

        <AnimatePresence>
          {showAnalysis && (
            <AnalysisPanel rooms={rooms} furniture={furniture} doors={doors} onClose={() => setShowAnalysis(false)} />
          )}
        </AnimatePresence>
      </div>

      <ImageUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onImageLoaded={setBackgroundImage} />
      <SpaceScanModal isOpen={showScan} onClose={() => setShowScan(false)} onScanComplete={setBackgroundImage} />
      <ExportTools isOpen={showExport} onClose={() => setShowExport(false)} rooms={rooms} furniture={furniture} doors={doors} windows={windows} onLoadProject={loadProject} />
      <AIChatWidget rooms={rooms} furniture={furniture} doors={doors} />
    </div>
  );
}
