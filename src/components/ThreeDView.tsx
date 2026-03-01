import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useMemo } from 'react';
import type { Room, FurnitureItem, DoorItem } from '@/types/editor';

const SCALE = 0.02; // Convert canvas units to 3D units

function RoomMesh({ room }: { room: Room }) {
  const w = room.width * SCALE;
  const h = room.height * SCALE;
  const wallHeight = 1.2;
  const wallThickness = 0.06;

  return (
    <group position={[(room.x + room.width / 2) * SCALE - 10, 0, (room.y + room.height / 2) * SCALE - 7]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.8} />
      </mesh>
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, -h / 2]} castShadow>
        <boxGeometry args={[w, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.6} />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, wallHeight / 2, h / 2]} castShadow>
        <boxGeometry args={[w, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.6} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-w / 2, wallHeight / 2, 0]} castShadow>
        <boxGeometry args={[wallThickness, wallHeight, h]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.6} />
      </mesh>
      {/* Right wall */}
      <mesh position={[w / 2, wallHeight / 2, 0]} castShadow>
        <boxGeometry args={[wallThickness, wallHeight, h]} />
        <meshStandardMaterial color="#cccccc" roughness={0.6} />
      </mesh>
    </group>
  );
}

function FurnitureMesh({ item }: { item: FurnitureItem }) {
  const w = item.width * SCALE;
  const h = item.height * SCALE;
  const furnitureHeight = getFurnitureHeight(item.type);

  const color = useMemo(() => {
    const colors: Record<string, string> = {
      sofa: '#4a4a4a', armchair: '#555', 'coffee-table': '#8b7355',
      'tv-unit': '#333', bookshelf: '#6b5b3a', 'bed-double': '#5a5a6e',
      'bed-single': '#5a5a6e', wardrobe: '#4a4a3a', nightstand: '#7a6a5a',
      dresser: '#6a5a4a', 'dining-table': '#7b6b4b', chair: '#5a5a5a',
      'kitchen-counter': '#888', stove: '#444', fridge: '#aaa',
      sink: '#999', bathtub: '#bbb', toilet: '#ccc',
      basin: '#aab', desk: '#6a5a4a', 'office-chair': '#555',
    };
    return colors[item.type] || '#666';
  }, [item.type]);

  const rotY = (item.rotation * Math.PI) / 180;

  return (
    <mesh
      position={[(item.x + item.width / 2) * SCALE - 10, furnitureHeight / 2, (item.y + item.height / 2) * SCALE - 7]}
      rotation={[0, rotY, 0]}
      castShadow
    >
      <boxGeometry args={[w, furnitureHeight, h]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
    </mesh>
  );
}

function DoorMesh({ door }: { door: DoorItem }) {
  const w = door.width * SCALE;
  const rotY = (door.rotation * Math.PI) / 180;

  return (
    <mesh
      position={[(door.x + door.width / 2) * SCALE - 10, 0.5, (door.y + door.height / 2) * SCALE - 7]}
      rotation={[0, rotY, 0]}
      castShadow
    >
      <boxGeometry args={[w, 1, 0.04]} />
      <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

function getFurnitureHeight(type: string): number {
  const heights: Record<string, number> = {
    sofa: 0.4, armchair: 0.4, 'coffee-table': 0.2, 'tv-unit': 0.25,
    bookshelf: 0.8, 'bed-double': 0.25, 'bed-single': 0.25,
    wardrobe: 0.9, nightstand: 0.25, dresser: 0.35,
    'dining-table': 0.35, chair: 0.4, 'kitchen-counter': 0.4,
    stove: 0.4, fridge: 0.8, sink: 0.4, bathtub: 0.3,
    toilet: 0.35, basin: 0.35, desk: 0.35, 'office-chair': 0.45,
  };
  return heights[type] || 0.3;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#f0f0f0" roughness={1} />
    </mesh>
  );
}

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
}

export default function ThreeDView({ rooms, furniture, doors }: Props) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border bg-card">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3}
          maxDistance={25}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow shadow-mapSize={2048} />
        <directionalLight position={[-5, 10, -5]} intensity={0.3} />
        <Environment preset="city" />
        <Ground />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={30} blur={2} />
        {rooms.map(room => <RoomMesh key={room.id} room={room} />)}
        {furniture.map(item => <FurnitureMesh key={item.id} item={item} />)}
        {doors.map(door => <DoorMesh key={door.id} door={door} />)}
      </Canvas>
    </div>
  );
}
