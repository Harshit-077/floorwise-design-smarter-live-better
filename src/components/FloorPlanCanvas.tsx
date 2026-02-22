import { useRef, useState, useCallback, useEffect } from 'react';
import type { Room, FurnitureItem, DoorItem, EditorTool } from '@/types/editor';

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  selectedId: string | null;
  activeTool: EditorTool;
  onSelectItem: (id: string | null) => void;
  onMoveFurniture: (id: string, x: number, y: number) => void;
  onMoveRoom: (id: string, x: number, y: number) => void;
  onMoveDoor: (id: string, x: number, y: number) => void;
  onDeleteItem: (id: string) => void;
  backgroundImage?: string | null;
}

export default function FloorPlanCanvas({
  rooms, furniture, doors, selectedId, activeTool,
  onSelectItem, onMoveFurniture, onMoveRoom, onMoveDoor, onDeleteItem,
  backgroundImage,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ id: string; type: 'room' | 'furniture' | 'door'; offsetX: number; offsetY: number } | null>(null);

  const getSVGPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 1000 / rect.width;
    const scaleY = 700 / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string, type: 'room' | 'furniture' | 'door', itemX: number, itemY: number) => {
    e.stopPropagation();
    if (activeTool === 'delete') { onDeleteItem(id); return; }
    if (activeTool !== 'select') return;
    const pt = getSVGPoint(e);
    setDragging({ id, type, offsetX: pt.x - itemX, offsetY: pt.y - itemY });
    onSelectItem(id);
  }, [activeTool, getSVGPoint, onSelectItem, onDeleteItem]);

  const handleTouchStart = useCallback((e: React.TouchEvent, id: string, type: 'room' | 'furniture' | 'door', itemX: number, itemY: number) => {
    e.stopPropagation();
    if (activeTool === 'delete') { onDeleteItem(id); return; }
    if (activeTool !== 'select') return;
    const pt = getSVGPoint(e);
    setDragging({ id, type, offsetX: pt.x - itemX, offsetY: pt.y - itemY });
    onSelectItem(id);
  }, [activeTool, getSVGPoint, onSelectItem, onDeleteItem]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const pt = getSVGPoint(e);
    const newX = Math.round((pt.x - dragging.offsetX) / 10) * 10;
    const newY = Math.round((pt.y - dragging.offsetY) / 10) * 10;
    if (dragging.type === 'furniture') onMoveFurniture(dragging.id, newX, newY);
    else if (dragging.type === 'door') onMoveDoor(dragging.id, newX, newY);
    else onMoveRoom(dragging.id, newX, newY);
  }, [dragging, getSVGPoint, onMoveFurniture, onMoveRoom, onMoveDoor]);

  const handleEnd = useCallback(() => setDragging(null), []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).id === 'grid-bg') onSelectItem(null);
  }, [onSelectItem]);

  useEffect(() => {
    const up = () => setDragging(null);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  const getFurnitureColor = (type: string) => {
    const colors: Record<string, string> = {
      sofa: 'hsl(0 0% 25%)', armchair: 'hsl(0 0% 30%)', 'coffee-table': 'hsl(0 0% 40%)',
      'tv-unit': 'hsl(0 0% 22%)', bookshelf: 'hsl(0 0% 35%)', 'bed-double': 'hsl(0 0% 28%)',
      'bed-single': 'hsl(0 0% 32%)', wardrobe: 'hsl(0 0% 27%)', nightstand: 'hsl(0 0% 38%)',
      dresser: 'hsl(0 0% 33%)', 'dining-table': 'hsl(0 0% 36%)', chair: 'hsl(0 0% 40%)',
      'kitchen-counter': 'hsl(0 0% 42%)', stove: 'hsl(0 0% 20%)', fridge: 'hsl(0 0% 75%)',
      sink: 'hsl(0 0% 55%)', bathtub: 'hsl(0 0% 65%)', toilet: 'hsl(0 0% 80%)',
      basin: 'hsl(0 0% 60%)', desk: 'hsl(0 0% 34%)', 'office-chair': 'hsl(0 0% 30%)',
    };
    return colors[type] || 'hsl(0 0% 35%)';
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 700"
      className="w-full h-full canvas-grid bg-card rounded-xl border cursor-crosshair select-none touch-none"
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onClick={handleCanvasClick}
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
      <rect id="grid-bg" width="1000" height="700" fill="url(#grid)" />
      {backgroundImage && (
        <image href={backgroundImage} x="0" y="0" width="1000" height="700" opacity="0.3" preserveAspectRatio="xMidYMid slice" />
      )}

      {/* Rooms */}
      {rooms.map(room => (
        <g key={room.id}
          onMouseDown={(e) => handleMouseDown(e, room.id, 'room', room.x, room.y)}
          onTouchStart={(e) => handleTouchStart(e, room.id, 'room', room.x, room.y)}
          style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
        >
          <rect
            x={room.x} y={room.y} width={room.width} height={room.height}
            fill={room.color} stroke={selectedId === room.id ? 'hsl(0 0% 40%)' : 'hsl(0 0% 15%)'}
            strokeWidth={selectedId === room.id ? 3 : 2} rx="4"
            opacity={0.6}
          />
          <text
            x={room.x + room.width / 2} y={room.y + room.height / 2}
            textAnchor="middle" dominantBaseline="central"
            fontSize="13" fontWeight="600" fill="hsl(0 0% 15%)"
            fontFamily="Space Grotesk, sans-serif" pointerEvents="none"
          >
            {room.name}
          </text>
          <text
            x={room.x + room.width / 2} y={room.y + room.height / 2 + 18}
            textAnchor="middle" dominantBaseline="central"
            fontSize="10" fill="hsl(0 0% 45%)" pointerEvents="none"
          >
            {(room.width / 50 * 1.5).toFixed(1)}m × {(room.height / 50 * 1.5).toFixed(1)}m
          </text>
        </g>
      ))}

      {/* Doors */}
      {doors.map(door => (
        <g key={door.id}
          onMouseDown={(e) => handleMouseDown(e, door.id, 'door', door.x, door.y)}
          onTouchStart={(e) => handleTouchStart(e, door.id, 'door', door.x, door.y)}
          style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
          transform={`rotate(${door.rotation} ${door.x + door.width / 2} ${door.y + door.height / 2})`}
        >
          <rect
            x={door.x} y={door.y} width={door.width} height={door.height}
            fill="hsl(0 0% 50%)"
            stroke={selectedId === door.id ? 'hsl(0 0% 20%)' : 'hsl(0 0% 10%)'}
            strokeWidth={selectedId === door.id ? 2.5 : 1}
            rx="2"
          />
          {/* Door swing arc */}
          <path
            d={`M ${door.x} ${door.y + door.height} A ${door.width} ${door.width} 0 0 1 ${door.x + door.width} ${door.y + door.height}`}
            fill="none" stroke="hsl(0 0% 40%)" strokeWidth="1" strokeDasharray="3 2"
            pointerEvents="none"
          />
          <text
            x={door.x + door.width / 2} y={door.y + door.height / 2}
            textAnchor="middle" dominantBaseline="central"
            fontSize="7" fill="hsl(0 0% 95%)" fontWeight="500" pointerEvents="none"
          >
            Door
          </text>
        </g>
      ))}

      {/* Furniture */}
      {furniture.map(item => (
        <g key={item.id}
          onMouseDown={(e) => handleMouseDown(e, item.id, 'furniture', item.x, item.y)}
          onTouchStart={(e) => handleTouchStart(e, item.id, 'furniture', item.x, item.y)}
          style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
          transform={`rotate(${item.rotation} ${item.x + item.width / 2} ${item.y + item.height / 2})`}
        >
          <rect
            x={item.x} y={item.y} width={item.width} height={item.height}
            fill={getFurnitureColor(item.type)}
            stroke={selectedId === item.id ? 'hsl(0 0% 50%)' : 'hsl(0 0% 10%)'}
            strokeWidth={selectedId === item.id ? 2.5 : 1}
            rx="3" opacity={0.85}
          />
          <text
            x={item.x + item.width / 2} y={item.y + item.height / 2}
            textAnchor="middle" dominantBaseline="central"
            fontSize={Math.min(item.width, item.height) < 30 ? '7' : '9'}
            fill="hsl(0 0% 95%)" fontWeight="500" pointerEvents="none"
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Empty state */}
      {rooms.length === 0 && furniture.length === 0 && doors.length === 0 && (
        <text
          x="500" y="350" textAnchor="middle" dominantBaseline="central"
          fontSize="16" fill="hsl(0 0% 65%)" fontFamily="Space Grotesk, sans-serif"
        >
          Add rooms from the panel to get started
        </text>
      )}
    </svg>
  );
}
