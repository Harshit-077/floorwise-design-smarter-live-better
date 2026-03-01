import { motion } from 'framer-motion';
import { X, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Room, FurnitureItem, DoorItem } from '@/types/editor';

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  onClose: () => void;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <motion.circle
            cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-display font-bold">{score}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center font-medium">{label}</span>
    </div>
  );
}

function analyzeLayout(rooms: Room[], furniture: FurnitureItem[], doors: DoorItem[]) {
  const roomCount = rooms.length;
  const furnCount = furniture.length;
  const doorCount = doors.length;

  // Calculate total room area and furniture footprint
  const totalRoomArea = rooms.reduce((sum, r) => sum + r.width * r.height, 0);
  const totalFurnArea = furniture.reduce((sum, f) => sum + f.width * f.height, 0);
  const furnDensity = totalRoomArea > 0 ? totalFurnArea / totalRoomArea : 0;

  // Check furniture-door proximity (door clearance)
  let doorBlockCount = 0;
  doors.forEach(door => {
    const doorClearZone = { x: door.x - 20, y: door.y - 20, w: door.width + 40, h: door.height + 40 };
    furniture.forEach(f => {
      if (f.x < doorClearZone.x + doorClearZone.w && f.x + f.width > doorClearZone.x &&
          f.y < doorClearZone.y + doorClearZone.h && f.y + f.height > doorClearZone.y) {
        doorBlockCount++;
      }
    });
  });

  // Check furniture overlap
  let overlapCount = 0;
  for (let i = 0; i < furniture.length; i++) {
    for (let j = i + 1; j < furniture.length; j++) {
      const a = furniture[i], b = furniture[j];
      if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) {
        overlapCount++;
      }
    }
  }

  // Circulation: penalize blocked doors, overlaps, high density
  const circBase = 85;
  const circScore = Math.min(98, Math.max(15, circBase - doorBlockCount * 15 - overlapCount * 10 - furnDensity * 30 + roomCount * 3));

  // Space efficiency: good density is 0.25-0.45
  const idealDensity = 0.35;
  const densityDiff = Math.abs(furnDensity - idealDensity);
  const spaceScore = Math.min(98, Math.max(10, 90 - densityDiff * 200 + (roomCount > 0 ? 5 : -20)));

  // Storage: count storage furniture
  const storageTypes = ['wardrobe', 'bookshelf', 'dresser', 'kitchen-counter'];
  const storageCount = furniture.filter(f => storageTypes.includes(f.type)).length;
  const storageScore = Math.min(95, Math.max(10, 30 + storageCount * 18 + (roomCount > 2 ? 10 : 0)));

  // Light: penalize tall furniture near room edges (simulating window blocking)
  const tallItems = furniture.filter(f => f.height > 60 || f.width > 60);
  let lightPenalty = 0;
  tallItems.forEach(f => {
    rooms.forEach(r => {
      if (Math.abs(f.x - r.x) < 30 || Math.abs(f.x + f.width - r.x - r.width) < 30) lightPenalty += 8;
    });
  });
  const lightScore = Math.min(98, Math.max(15, 80 - lightPenalty + doorCount * 3));

  // Door accessibility
  const doorAccessScore = doorCount > 0
    ? Math.min(95, Math.max(20, 90 - doorBlockCount * 20))
    : roomCount > 0 ? 25 : 50;

  const overall = Math.round((circScore + spaceScore + storageScore + lightScore + doorAccessScore) / 5);

  const suggestions: string[] = [];
  if (doorBlockCount > 0) suggestions.push(`${doorBlockCount} door(s) have furniture blocking clearance — move items at least 0.6m away.`);
  if (overlapCount > 0) suggestions.push(`${overlapCount} furniture overlap(s) detected — separate items for better usability.`);
  if (furnDensity > 0.5) suggestions.push('Room utilization exceeds 50% — consider removing items to improve walkability.');
  if (furnDensity < 0.15 && furnCount > 0) suggestions.push('Rooms appear sparse — add functional furniture to improve space utility.');
  if (storageCount === 0 && roomCount > 0) suggestions.push('No storage units detected — add wardrobes or shelving for better organization.');
  if (lightPenalty > 10) suggestions.push('Tall furniture near room edges may block natural light — reposition away from walls.');
  if (doorCount === 0 && roomCount > 0) suggestions.push('No doors placed — add doors to properly define room access and flow.');
  const hasKitchen = rooms.some(r => r.name.toLowerCase().includes('kitchen'));
  if (hasKitchen) {
    const kitchenEssentials = ['stove', 'sink', 'fridge'];
    const missing = kitchenEssentials.filter(e => !furniture.some(f => f.type === e));
    if (missing.length > 0) suggestions.push(`Kitchen missing: ${missing.join(', ')}. Add for a functional work triangle.`);
  }
  if (furnCount === 0 && roomCount > 0) suggestions.push('Add furniture to get a complete spatial analysis.');
  if (roomCount === 0) suggestions.push('Add rooms to your layout before running a full analysis.');
  if (suggestions.length === 0) suggestions.push('Excellent layout! All metrics are within optimal range.');

  const risks: string[] = [];
  if (doorBlockCount > 1) risks.push('Multiple doors are obstructed — fire safety risk.');
  if (overlapCount > 2) risks.push('Significant furniture overlap — unusable zones detected.');
  if (furnDensity > 0.6) risks.push('Critical overcrowding — congestion likely in daily use.');
  if (roomCount > 0 && doorCount === 0) risks.push('Rooms have no doors — circulation path undefined.');

  return {
    scores: [
      { label: 'Circulation', score: Math.round(circScore), color: 'hsl(245 58% 51%)' },
      { label: 'Space Efficiency', score: Math.round(spaceScore), color: 'hsl(199 89% 48%)' },
      { label: 'Storage', score: Math.round(storageScore), color: 'hsl(262 83% 58%)' },
      { label: 'Natural Light', score: Math.round(lightScore), color: 'hsl(38 92% 50%)' },
      { label: 'Door Access', score: Math.round(doorAccessScore), color: 'hsl(152 69% 41%)' },
    ],
    overall,
    suggestions,
    risks,
  };
}

export default function AnalysisPanel({ rooms, furniture, doors, onClose }: Props) {
  const analysis = analyzeLayout(rooms, furniture, doors);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-40 md:relative md:inset-auto w-full md:w-80 flex-shrink-0 glass-card overflow-hidden flex flex-col h-full"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base">Layout Analysis</h3>
          <p className="text-xs text-muted-foreground">AI-powered evaluation</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-2">
            <svg className="w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r="46" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="56" cy="56" r="46" fill="none"
                stroke={analysis.overall >= 70 ? 'hsl(142 71% 45%)' : analysis.overall >= 50 ? 'hsl(0 0% 50%)' : 'hsl(0 72% 51%)'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 46 - (analysis.overall / 100) * 2 * Math.PI * 46 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold">{analysis.overall}</span>
              <span className="text-[10px] text-muted-foreground">Livability</span>
            </div>
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-2 gap-4">
          {analysis.scores.map(s => (
            <ScoreRing key={s.label} {...s} />
          ))}
        </div>

        {/* Risk Alerts */}
        {analysis.risks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h4 className="text-sm font-semibold">Risk Alerts</h4>
            </div>
            <div className="space-y-2">
              {analysis.risks.map((r, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-warning/10 border border-warning/20 text-xs leading-relaxed">
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-secondary" />
            <h4 className="text-sm font-semibold">AI Suggestions</h4>
          </div>
          <div className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 text-xs leading-relaxed">
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {analysis.overall >= 70 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            <span className="text-xs">Layout meets recommended livability standards.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
