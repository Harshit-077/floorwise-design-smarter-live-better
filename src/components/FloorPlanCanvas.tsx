import { useRef, useState, useCallback, useEffect } from 'react';
<<<<<<< HEAD
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
=======
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
import type { Room, FurnitureItem, DoorItem, WindowItem, EditorTool } from '@/types/editor';

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  windows: WindowItem[];
  selectedId: string | null;
  activeTool: EditorTool;
  onSelectItem: (id: string | null) => void;
  onMoveFurniture: (id: string, x: number, y: number) => void;
  onMoveRoom: (id: string, x: number, y: number) => void;
  onResizeRoom: (id: string, width: number, height: number) => void;
  onResizeFurniture: (id: string, width: number, height: number) => void;
  onResizeDoor: (id: string, width: number, height: number) => void;
  onResizeWindow: (id: string, width: number, height: number) => void;
  onMoveDoor: (id: string, x: number, y: number) => void;
  onMoveWindow: (id: string, x: number, y: number) => void;
<<<<<<< HEAD
  onResizeWindow: (id: string, width: number, height: number) => void;
=======
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
  onDeleteItem: (id: string) => void;
  backgroundImage?: string | null;
}

type DragMode =
  | { mode: 'move'; id: string; type: 'room' | 'furniture' | 'door' | 'window'; offsetX: number; offsetY: number }
<<<<<<< HEAD
  | { mode: 'resize'; id: string; itemType: 'room' | 'furniture' | 'door' | 'window'; handle: string; startX: number; startY: number; origX: number; origY: number; origW: number; origH: number }
  | { mode: 'pan'; startX: number; startY: number; origPanX: number; origPanY: number };

const BASE_W = 1000;
const BASE_H = 700;

export default function FloorPlanCanvas({
  rooms, furniture, doors, windows, selectedId, activeTool,
  onSelectItem, onMoveFurniture, onMoveRoom, onResizeRoom, onResizeFurniture, onResizeDoor, onMoveDoor,
  onMoveWindow, onResizeWindow, onDeleteItem,
=======
  | { mode: 'resize'; id: string; itemType: 'room' | 'furniture' | 'door' | 'window'; handle: string; startX: number; startY: number; origX: number; origY: number; origW: number; origH: number };

export default function FloorPlanCanvas({
  rooms, furniture, doors, windows, selectedId, activeTool,
  onSelectItem, onMoveFurniture, onMoveRoom, onResizeRoom, onResizeFurniture, onResizeDoor, onResizeWindow, onMoveDoor, onMoveWindow, onDeleteItem,
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
  backgroundImage,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<DragMode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const viewBox = `${pan.x} ${pan.y} ${BASE_W / zoom} ${BASE_H / zoom}`;

  const getSVGPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = (BASE_W / zoom) / rect.width;
    const scaleY = (BASE_H / zoom) / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX + pan.x, y: (clientY - rect.top) * scaleY + pan.y };
  }, [zoom, pan]);

  const getClientPoint = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) return { cx: e.touches[0].clientX, cy: e.touches[0].clientY };
    if ('clientX' in e) return { cx: e.clientX, cy: e.clientY };
    return { cx: 0, cy: 0 };
  }, []);

<<<<<<< HEAD
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z * 1.25, 4)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z / 1.25, 0.25)), []);
  const handleZoomReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // Wheel zoom
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newZoom = Math.max(0.25, Math.min(4, zoom * factor));

      // Zoom towards cursor
      const rect = svg.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      const vw = BASE_W / zoom;
      const vh = BASE_H / zoom;
      const nvw = BASE_W / newZoom;
      const nvh = BASE_H / newZoom;
      setPan(p => ({
        x: p.x + (vw - nvw) * mx,
        y: p.y + (vh - nvh) * my,
      }));
      setZoom(newZoom);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoom]);

=======
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
  const handleMouseDown = useCallback((e: React.MouseEvent, id: string, type: 'room' | 'furniture' | 'door' | 'window', itemX: number, itemY: number) => {
    e.stopPropagation();
    if (activeTool === 'delete') { onDeleteItem(id); return; }
    if (activeTool !== 'select') return;
    const pt = getSVGPoint(e);
    setDrag({ mode: 'move', id, type, offsetX: pt.x - itemX, offsetY: pt.y - itemY });
    onSelectItem(id);
  }, [activeTool, getSVGPoint, onSelectItem, onDeleteItem]);

  const handleTouchStart = useCallback((e: React.TouchEvent, id: string, type: 'room' | 'furniture' | 'door' | 'window', itemX: number, itemY: number) => {
    e.stopPropagation();
    if (activeTool === 'delete') { onDeleteItem(id); return; }
    if (activeTool !== 'select') return;
    const pt = getSVGPoint(e);
    setDrag({ mode: 'move', id, type, offsetX: pt.x - itemX, offsetY: pt.y - itemY });
    onSelectItem(id);
  }, [activeTool, getSVGPoint, onSelectItem, onDeleteItem]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, id: string, itemType: 'room' | 'furniture' | 'door' | 'window', handle: string, x: number, y: number, w: number, h: number) => {
    e.stopPropagation();
    const pt = getSVGPoint(e);
    setDrag({ mode: 'resize', id, itemType, handle, startX: pt.x, startY: pt.y, origX: x, origY: y, origW: w, origH: h });
  }, [getSVGPoint]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag) return;
    e.preventDefault();

    if (drag.mode === 'pan') {
      const { cx, cy } = getClientPoint(e as any);
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = (BASE_W / zoom) / rect.width;
      const scaleY = (BASE_H / zoom) / rect.height;
      setPan({
        x: drag.origPanX - (cx - drag.startX) * scaleX,
        y: drag.origPanY - (cy - drag.startY) * scaleY,
      });
      return;
    }

    const pt = getSVGPoint(e);

    if (drag.mode === 'move') {
      const newX = Math.round((pt.x - drag.offsetX) / 10) * 10;
      const newY = Math.round((pt.y - drag.offsetY) / 10) * 10;
      if (drag.type === 'furniture') onMoveFurniture(drag.id, newX, newY);
      else if (drag.type === 'door') onMoveDoor(drag.id, newX, newY);
      else if (drag.type === 'window') onMoveWindow(drag.id, newX, newY);
      else onMoveRoom(drag.id, newX, newY);
    } else if (drag.mode === 'resize') {
      const dx = pt.x - drag.startX;
      const dy = pt.y - drag.startY;
      let newW = drag.origW, newH = drag.origH, newX = drag.origX, newY = drag.origY;
      const MIN = drag.itemType === 'door' || drag.itemType === 'window' ? 20 : drag.itemType === 'furniture' ? 15 : 60;

      if (drag.handle.includes('e')) newW = Math.max(MIN, Math.round((drag.origW + dx) / 10) * 10);
      if (drag.handle.includes('s')) newH = Math.max(MIN, Math.round((drag.origH + dy) / 10) * 10);
      if (drag.handle.includes('w')) {
        const moved = Math.round(dx / 10) * 10;
        newW = Math.max(MIN, drag.origW - moved);
        if (newW !== MIN) newX = drag.origX + moved;
      }
      if (drag.handle.includes('n')) {
        const moved = Math.round(dy / 10) * 10;
        newH = Math.max(MIN, drag.origH - moved);
        if (newH !== MIN) newY = drag.origY + moved;
      }

      if (drag.itemType === 'room') {
        onMoveRoom(drag.id, newX, newY);
        onResizeRoom(drag.id, newW, newH);
      } else if (drag.itemType === 'furniture') {
        onMoveFurniture(drag.id, newX, newY);
        onResizeFurniture(drag.id, newW, newH);
      } else if (drag.itemType === 'window') {
        onMoveWindow(drag.id, newX, newY);
        onResizeWindow(drag.id, newW, newH);
      } else {
        onMoveDoor(drag.id, newX, newY);
        onResizeDoor(drag.id, newW, newH);
      }
    }
<<<<<<< HEAD
  }, [drag, getSVGPoint, getClientPoint, zoom, onMoveFurniture, onMoveRoom, onMoveDoor, onMoveWindow, onResizeRoom, onResizeFurniture, onResizeDoor, onResizeWindow]);
=======
  }, [drag, getSVGPoint, onMoveFurniture, onMoveRoom, onMoveDoor, onMoveWindow, onResizeRoom, onResizeFurniture, onResizeDoor, onResizeWindow]);
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3

  const handleEnd = useCallback(() => setDrag(null), []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle click to pan
    if (e.button === 1) {
      e.preventDefault();
      setDrag({ mode: 'pan', startX: e.clientX, startY: e.clientY, origPanX: pan.x, origPanY: pan.y });
      return;
    }
    if (e.target === svgRef.current || (e.target as SVGElement).id === 'grid-bg') onSelectItem(null);
  }, [onSelectItem, pan]);

  useEffect(() => {
    const up = () => setDrag(null);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  // Space key for panning
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !drag) {
        e.preventDefault();
        const svg = svgRef.current;
        if (svg) svg.style.cursor = 'grab';
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const svg = svgRef.current;
        if (svg) svg.style.cursor = 'crosshair';
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [drag]);

  const getFurnitureColor = (type: string) => {
    const colors: Record<string, string> = {
      sofa: 'hsl(152 50% 38%)', armchair: 'hsl(152 45% 42%)', 'coffee-table': 'hsl(30 60% 45%)',
      'tv-unit': 'hsl(220 40% 35%)', bookshelf: 'hsl(30 50% 40%)', 'bed-double': 'hsl(200 45% 40%)',
      'bed-single': 'hsl(200 40% 45%)', wardrobe: 'hsl(200 40% 38%)', nightstand: 'hsl(30 45% 42%)',
      dresser: 'hsl(200 35% 42%)', 'dining-table': 'hsl(30 55% 42%)', chair: 'hsl(30 50% 48%)',
<<<<<<< HEAD
      'kitchen-counter': 'hsl(168 50% 38%)', stove: 'hsl(0 50% 40%)', fridge: 'hsl(199 60% 55%)',
      sink: 'hsl(199 50% 55%)', bathtub: 'hsl(199 55% 55%)', toilet: 'hsl(0 0% 70%)',
      basin: 'hsl(199 45% 55%)', desk: 'hsl(30 45% 40%)', 'office-chair': 'hsl(152 40% 40%)',
=======
      'kitchen-counter': 'hsl(199 50% 40%)', stove: 'hsl(0 50% 40%)', fridge: 'hsl(199 60% 65%)',
      sink: 'hsl(199 50% 55%)', bathtub: 'hsl(199 55% 60%)', toilet: 'hsl(0 0% 75%)',
      basin: 'hsl(199 45% 55%)', desk: 'hsl(30 45% 40%)', 'office-chair': 'hsl(245 40% 45%)',
      'car-porch': 'hsl(0 0% 60%)', staircase: 'hsl(30 30% 50%)',
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
    };
    return colors[type] || 'hsl(152 40% 40%)';
  };

  const HANDLE_SIZE = 10;
<<<<<<< HEAD

=======
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
  const renderHandles = (id: string, x: number, y: number, width: number, height: number, itemType: 'room' | 'furniture' | 'door' | 'window') => {
    if (selectedId !== id || activeTool !== 'select') return null;
    const hs = itemType === 'room' ? HANDLE_SIZE : 8;
    const handles = [
      { key: 'n', hx: x + width / 2 - hs / 2, hy: y - hs / 2, cursor: 'ns-resize' },
      { key: 's', hx: x + width / 2 - hs / 2, hy: y + height - hs / 2, cursor: 'ns-resize' },
      { key: 'w', hx: x - hs / 2, hy: y + height / 2 - hs / 2, cursor: 'ew-resize' },
      { key: 'e', hx: x + width - hs / 2, hy: y + height / 2 - hs / 2, cursor: 'ew-resize' },
      { key: 'nw', hx: x - hs / 2, hy: y - hs / 2, cursor: 'nwse-resize' },
      { key: 'ne', hx: x + width - hs / 2, hy: y - hs / 2, cursor: 'nesw-resize' },
      { key: 'sw', hx: x - hs / 2, hy: y + height - hs / 2, cursor: 'nesw-resize' },
      { key: 'se', hx: x + width - hs / 2, hy: y + height - hs / 2, cursor: 'nwse-resize' },
    ];
    return handles.map(handle => (
      <rect
        key={handle.key}
        x={handle.hx} y={handle.hy} width={hs} height={hs}
        fill="hsl(152 55% 38%)" stroke="hsl(152 55% 60%)" strokeWidth="1" rx="2"
        style={{ cursor: handle.cursor }}
        onMouseDown={(e) => handleResizeStart(e, id, itemType, handle.key, x, y, width, height)}
        onTouchStart={(e) => handleResizeStart(e, id, itemType, handle.key, x, y, width, height)}
      />
    ));
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full canvas-grid bg-card rounded-xl border cursor-crosshair select-none touch-none"
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleCanvasMouseDown}
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(0 0% 90%)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(0 0% 85%)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect id="grid-bg" x={pan.x - 500} y={pan.y - 500} width={BASE_W / zoom + 1000} height={BASE_H / zoom + 1000} fill="url(#grid)" />
        {backgroundImage && (
          <image href={backgroundImage} x="0" y="0" width="1000" height="700" opacity="0.3" preserveAspectRatio="xMidYMid slice" />
        )}

        {/* Rooms */}
        {rooms.map(room => (
          <g key={room.id}>
            <g
              onMouseDown={(e) => handleMouseDown(e, room.id, 'room', room.x, room.y)}
              onTouchStart={(e) => handleTouchStart(e, room.id, 'room', room.x, room.y)}
              style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
            >
              <rect
                x={room.x} y={room.y} width={room.width} height={room.height}
                fill={room.color} stroke={selectedId === room.id ? 'hsl(152 55% 38%)' : 'hsl(222 47% 20%)'}
                strokeWidth={selectedId === room.id ? 3 : 2} rx="4" opacity={0.6}
              />
              <text x={room.x + room.width / 2} y={room.y + room.height / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="13" fontWeight="600" fill="hsl(0 0% 15%)"
                fontFamily="Space Grotesk, sans-serif" pointerEvents="none"
              >{room.name}</text>
              <text x={room.x + room.width / 2} y={room.y + room.height / 2 + 18}
                textAnchor="middle" dominantBaseline="central"
                fontSize="10" fill="hsl(0 0% 45%)" pointerEvents="none"
              >{(room.width / 50 * 1.5).toFixed(1)}m × {(room.height / 50 * 1.5).toFixed(1)}m</text>
            </g>
            {renderHandles(room.id, room.x, room.y, room.width, room.height, 'room')}
          </g>
        ))}

        {/* Doors */}
        {doors.map(door => (
          <g key={door.id}>
            <g
              onMouseDown={(e) => handleMouseDown(e, door.id, 'door', door.x, door.y)}
              onTouchStart={(e) => handleTouchStart(e, door.id, 'door', door.x, door.y)}
              style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
              transform={`rotate(${door.rotation} ${door.x + door.width / 2} ${door.y + door.height / 2})`}
            >
              <rect x={door.x} y={door.y} width={door.width} height={door.height}
                fill="hsl(152 60% 40%)" stroke={selectedId === door.id ? 'hsl(152 55% 38%)' : 'hsl(152 60% 25%)'}
                strokeWidth={selectedId === door.id ? 2.5 : 1} rx="2"
              />
              <path
                d={`M ${door.x} ${door.y + door.height} A ${door.width} ${door.width} 0 0 1 ${door.x + door.width} ${door.y + door.height}`}
                fill="none" stroke="hsl(0 0% 40%)" strokeWidth="1" strokeDasharray="3 2" pointerEvents="none"
              />
              <text x={door.x + door.width / 2} y={door.y + door.height / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="7" fill="hsl(0 0% 95%)" fontWeight="500" pointerEvents="none"
              >Door</text>
            </g>
            {renderHandles(door.id, door.x, door.y, door.width, door.height, 'door')}
          </g>
        ))}

<<<<<<< HEAD
        {/* Windows */}
        {windows.map(win => (
          <g key={win.id}>
            <g
              onMouseDown={(e) => handleMouseDown(e, win.id, 'window', win.x, win.y)}
              onTouchStart={(e) => handleTouchStart(e, win.id, 'window', win.x, win.y)}
              style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
              transform={`rotate(${win.rotation} ${win.x + win.width / 2} ${win.y + win.height / 2})`}
            >
              <rect x={win.x} y={win.y} width={win.width} height={win.height}
                fill="hsl(199 80% 70%)" stroke={selectedId === win.id ? 'hsl(152 55% 38%)' : 'hsl(199 60% 45%)'}
                strokeWidth={selectedId === win.id ? 2.5 : 1.5} rx="1" opacity={0.85}
              />
              {/* Window pane lines */}
              <line x1={win.x + win.width / 2} y1={win.y} x2={win.x + win.width / 2} y2={win.y + win.height}
                stroke="hsl(199 60% 45%)" strokeWidth="0.8" pointerEvents="none" />
              <text x={win.x + win.width / 2} y={win.y + win.height / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="6" fill="hsl(199 60% 25%)" fontWeight="500" pointerEvents="none"
              >Win</text>
            </g>
            {renderHandles(win.id, win.x, win.y, win.width, win.height, 'window')}
=======
      {/* Windows */}
      {windows.map(win => (
        <g key={win.id}>
          <g
            onMouseDown={(e) => handleMouseDown(e, win.id, 'window', win.x, win.y)}
            onTouchStart={(e) => handleTouchStart(e, win.id, 'window', win.x, win.y)}
            style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
            transform={`rotate(${win.rotation} ${win.x + win.width / 2} ${win.y + win.height / 2})`}
          >
            <rect x={win.x} y={win.y} width={win.width} height={win.height}
              fill="hsl(199 80% 65%)" stroke={selectedId === win.id ? 'hsl(245 58% 51%)' : 'hsl(199 60% 40%)'}
              strokeWidth={selectedId === win.id ? 2.5 : 1} rx="1" opacity={0.8}
            />
            {/* Window panes */}
            <line x1={win.x + win.width / 2} y1={win.y} x2={win.x + win.width / 2} y2={win.y + win.height}
              stroke="hsl(199 60% 40%)" strokeWidth="1" pointerEvents="none" />
            <line x1={win.x} y1={win.y + win.height / 2} x2={win.x + win.width} y2={win.y + win.height / 2}
              stroke="hsl(199 60% 40%)" strokeWidth="0.5" pointerEvents="none" />
            <text x={win.x + win.width / 2} y={win.y + win.height / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize="6" fill="hsl(199 60% 20%)" fontWeight="500" pointerEvents="none"
            >Win</text>
          </g>
          {renderHandles(win.id, win.x, win.y, win.width, win.height, 'window')}
        </g>
      ))}

      {/* Furniture */}
      {furniture.map(item => (
        <g key={item.id}>
          <g
            onMouseDown={(e) => handleMouseDown(e, item.id, 'furniture', item.x, item.y)}
            onTouchStart={(e) => handleTouchStart(e, item.id, 'furniture', item.x, item.y)}
            style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
            transform={`rotate(${item.rotation} ${item.x + item.width / 2} ${item.y + item.height / 2})`}
          >
            <rect x={item.x} y={item.y} width={item.width} height={item.height}
              fill={getFurnitureColor(item.type)}
              stroke={selectedId === item.id ? 'hsl(245 58% 60%)' : 'hsl(222 30% 20%)'}
              strokeWidth={selectedId === item.id ? 2.5 : 1} rx="3" opacity={0.85}
            />
            <text x={item.x + item.width / 2} y={item.y + item.height / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={Math.min(item.width, item.height) < 30 ? '7' : '9'}
              fill="hsl(0 0% 95%)" fontWeight="500" pointerEvents="none"
            >{item.label}</text>
            <text x={item.x + item.width / 2} y={item.y + item.height / 2 + 12}
              textAnchor="middle" dominantBaseline="central"
              fontSize="6" fill="hsl(0 0% 70%)" pointerEvents="none"
            >{(item.width / 50 * 1.5).toFixed(1)}×{(item.height / 50 * 1.5).toFixed(1)}m</text>
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
          </g>
        ))}

<<<<<<< HEAD
        {/* Furniture */}
        {furniture.map(item => (
          <g key={item.id}>
            <g
              onMouseDown={(e) => handleMouseDown(e, item.id, 'furniture', item.x, item.y)}
              onTouchStart={(e) => handleTouchStart(e, item.id, 'furniture', item.x, item.y)}
              style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
              transform={`rotate(${item.rotation} ${item.x + item.width / 2} ${item.y + item.height / 2})`}
            >
              <rect x={item.x} y={item.y} width={item.width} height={item.height}
                fill={getFurnitureColor(item.type)}
                stroke={selectedId === item.id ? 'hsl(152 55% 50%)' : 'hsl(222 30% 20%)'}
                strokeWidth={selectedId === item.id ? 2.5 : 1} rx="3" opacity={0.85}
              />
              <text x={item.x + item.width / 2} y={item.y + item.height / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize={Math.min(item.width, item.height) < 30 ? '7' : '9'}
                fill="hsl(0 0% 95%)" fontWeight="500" pointerEvents="none"
              >{item.label}</text>
              <text x={item.x + item.width / 2} y={item.y + item.height / 2 + 12}
                textAnchor="middle" dominantBaseline="central"
                fontSize="6" fill="hsl(0 0% 70%)" pointerEvents="none"
              >{(item.width / 50 * 1.5).toFixed(1)}×{(item.height / 50 * 1.5).toFixed(1)}m</text>
            </g>
            {renderHandles(item.id, item.x, item.y, item.width, item.height, 'furniture')}
          </g>
        ))}

        {rooms.length === 0 && furniture.length === 0 && doors.length === 0 && windows.length === 0 && (
          <text x={pan.x + (BASE_W / zoom) / 2} y={pan.y + (BASE_H / zoom) / 2} textAnchor="middle" dominantBaseline="central"
            fontSize="16" fill="hsl(0 0% 65%)" fontFamily="Space Grotesk, sans-serif"
          >Add rooms from the panel to get started</text>
        )}
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-card/90 backdrop-blur-sm border rounded-xl shadow-lg p-1">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomReset}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-xs font-mono text-center"
          title="Reset Zoom"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="text-[9px] text-center text-muted-foreground font-mono border-t pt-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
=======
      {rooms.length === 0 && furniture.length === 0 && doors.length === 0 && windows.length === 0 && (
        <text x="500" y="350" textAnchor="middle" dominantBaseline="central"
          fontSize="16" fill="hsl(0 0% 65%)" fontFamily="Space Grotesk, sans-serif"
        >Add rooms from the panel to get started</text>
      )}
    </svg>
>>>>>>> 6f7ffd091e4cfe4f9dc074660b4240af3bd884d3
  );
}
