import { useRef, useState, useCallback, useEffect } from 'react';
import type { Room, FurnitureItem, EditorTool } from '@/types/editor';

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
  selectedId: string | null;
  activeTool: EditorTool;
  onSelectItem: (id: string | null) => void;
  onMoveFurniture: (id: string, x: number, y: number) => void;
  onMoveRoom: (id: string, x: number, y: number) => void;
  onDeleteItem: (id: string) => void;
}

export default function FloorPlanCanvas({
  rooms, furniture, selectedId, activeTool,
  onSelectItem, onMoveFurniture, onMoveRoom, onDeleteItem,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ id: string; type: 'room' | 'furniture'; offsetX: number; offsetY: number } | null>(null);

  const getSVGPoint = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 1000 / rect.width;
    const scaleY = 700 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string, type: 'room' | 'furniture', itemX: number, itemY: number) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      onDeleteItem(id);
      return;
    }
    if (activeTool !== 'select') return;
    const pt = getSVGPoint(e);
    setDragging({ id, type, offsetX: pt.x - itemX, offsetY: pt.y - itemY });
    onSelectItem(id);
  }, [activeTool, getSVGPoint, onSelectItem, onDeleteItem]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const pt = getSVGPoint(e);
    const newX = Math.round((pt.x - dragging.offsetX) / 10) * 10;
    const newY = Math.round((pt.y - dragging.offsetY) / 10) * 10;
    if (dragging.type === 'furniture') {
      onMoveFurniture(dragging.id, newX, newY);
    } else {
      onMoveRoom(dragging.id, newX, newY);
    }
  }, [dragging, getSVGPoint, onMoveFurniture, onMoveRoom]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).id === 'grid-bg') {
      onSelectItem(null);
    }
  }, [onSelectItem]);

  useEffect(() => {
    const handleGlobalUp = () => setDragging(null);
    window.addEventListener('mouseup', handleGlobalUp);
    return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  const getFurnitureColor = (type: string) => {
    const colors: Record<string, string> = {
      sofa: 'hsl(220 32% 35%)', armchair: 'hsl(220 32% 40%)', 'coffee-table': 'hsl(27 30% 50%)',
      'tv-unit': 'hsl(220 20% 30%)', bookshelf: 'hsl(27 40% 45%)', 'bed-double': 'hsl(195 22% 45%)',
      'bed-single': 'hsl(195 22% 50%)', wardrobe: 'hsl(27 25% 40%)', nightstand: 'hsl(27 25% 50%)',
      dresser: 'hsl(27 25% 45%)', 'dining-table': 'hsl(27 30% 45%)', chair: 'hsl(27 30% 50%)',
      'kitchen-counter': 'hsl(220 15% 55%)', stove: 'hsl(0 0% 35%)', fridge: 'hsl(0 0% 85%)',
      sink: 'hsl(195 30% 70%)', bathtub: 'hsl(195 40% 80%)', toilet: 'hsl(0 0% 90%)',
      basin: 'hsl(195 30% 75%)', desk: 'hsl(27 25% 45%)', 'office-chair': 'hsl(220 20% 40%)',
    };
    return colors[type] || 'hsl(220 20% 50%)';
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 700"
      className="w-full h-full canvas-grid bg-card rounded-xl border cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(210 20% 92%)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)" />
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(210 20% 88%)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect id="grid-bg" width="1000" height="700" fill="url(#grid)" />

      {/* Rooms */}
      {rooms.map(room => (
        <g key={room.id}
          onMouseDown={(e) => handleMouseDown(e, room.id, 'room', room.x, room.y)}
          style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
        >
          <rect
            x={room.x} y={room.y} width={room.width} height={room.height}
            fill={room.color} stroke={selectedId === room.id ? 'hsl(195 80% 50%)' : 'hsl(220 32% 27%)'}
            strokeWidth={selectedId === room.id ? 3 : 2} rx="4"
            opacity={0.6}
          />
          <text
            x={room.x + room.width / 2} y={room.y + room.height / 2}
            textAnchor="middle" dominantBaseline="central"
            fontSize="13" fontWeight="600" fill="hsl(220 32% 27%)"
            fontFamily="Space Grotesk, sans-serif" pointerEvents="none"
          >
            {room.name}
          </text>
          <text
            x={room.x + room.width / 2} y={room.y + room.height / 2 + 18}
            textAnchor="middle" dominantBaseline="central"
            fontSize="10" fill="hsl(220 15% 50%)" pointerEvents="none"
          >
            {(room.width / 50 * 1.5).toFixed(1)}m × {(room.height / 50 * 1.5).toFixed(1)}m
          </text>
        </g>
      ))}

      {/* Furniture */}
      {furniture.map(item => (
        <g key={item.id}
          onMouseDown={(e) => handleMouseDown(e, item.id, 'furniture', item.x, item.y)}
          style={{ cursor: activeTool === 'select' ? 'move' : activeTool === 'delete' ? 'pointer' : 'default' }}
          transform={`rotate(${item.rotation} ${item.x + item.width / 2} ${item.y + item.height / 2})`}
        >
          <rect
            x={item.x} y={item.y} width={item.width} height={item.height}
            fill={getFurnitureColor(item.type)}
            stroke={selectedId === item.id ? 'hsl(195 80% 50%)' : 'hsl(220 32% 17%)'}
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
      {rooms.length === 0 && furniture.length === 0 && (
        <text
          x="500" y="350" textAnchor="middle" dominantBaseline="central"
          fontSize="16" fill="hsl(220 15% 70%)" fontFamily="Space Grotesk, sans-serif"
        >
          Add rooms from the panel to get started
        </text>
      )}
    </svg>
  );
}
