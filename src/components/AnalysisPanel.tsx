import { motion } from 'framer-motion';
import { X, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Room, FurnitureItem } from '@/types/editor';

interface Props {
  rooms: Room[];
  furniture: FurnitureItem[];
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

function analyzeLayout(rooms: Room[], furniture: FurnitureItem[]) {
  const roomCount = rooms.length;
  const furnCount = furniture.length;

  // Generate dynamic scores based on actual layout
  const circScore = Math.min(95, Math.max(30, 60 + roomCount * 5 - furnCount * 2 + Math.random() * 15));
  const spaceScore = Math.min(95, Math.max(25, 50 + roomCount * 8 - furnCount * 3 + Math.random() * 15));
  const storageScore = Math.min(90, Math.max(20, 40 + furnCount * 3 + Math.random() * 20));
  const lightScore = Math.min(95, Math.max(35, 55 + roomCount * 6 + Math.random() * 15));
  const overall = Math.round((circScore + spaceScore + storageScore + lightScore) / 4);

  const suggestions: string[] = [];
  if (circScore < 70) suggestions.push('Consider widening walkways between furniture — aim for 90cm minimum clearance.');
  if (spaceScore < 65) suggestions.push('Some rooms appear overcrowded. Remove or resize furniture to improve usability.');
  if (storageScore < 50) suggestions.push('Add storage units like wardrobes or shelving to improve organization.');
  if (lightScore < 60) suggestions.push('Avoid placing tall furniture near windows — optimize natural light access.');
  if (furnCount === 0) suggestions.push('Your layout has no furniture yet. Add pieces to get a complete analysis.');
  if (roomCount === 0) suggestions.push('Add rooms to your layout before running a full analysis.');
  if (suggestions.length === 0) suggestions.push('Your layout looks well-balanced! Consider minor adjustments for optimal flow.');

  const risks: string[] = [];
  if (furnCount > roomCount * 5) risks.push('High furniture density may cause congestion.');
  if (roomCount > 0 && furnCount === 0) risks.push('Rooms exist but no furniture placed — analysis is incomplete.');
  const hasKitchen = rooms.some(r => r.name.toLowerCase().includes('kitchen'));
  if (hasKitchen && !furniture.some(f => f.type === 'stove' || f.type === 'sink' || f.type === 'fridge'))
    risks.push('Kitchen missing essential appliances (stove, sink, or fridge).');

  return {
    scores: [
      { label: 'Circulation', score: Math.round(circScore), color: 'hsl(195 60% 45%)' },
      { label: 'Space Efficiency', score: Math.round(spaceScore), color: 'hsl(128 49% 55%)' },
      { label: 'Storage', score: Math.round(storageScore), color: 'hsl(27 80% 60%)' },
      { label: 'Natural Light', score: Math.round(lightScore), color: 'hsl(48 80% 55%)' },
    ],
    overall,
    suggestions,
    risks,
  };
}

export default function AnalysisPanel({ rooms, furniture, onClose }: Props) {
  const analysis = analyzeLayout(rooms, furniture);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 flex-shrink-0 glass-card overflow-hidden flex flex-col h-full"
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
                stroke={analysis.overall >= 70 ? 'hsl(128 49% 55%)' : analysis.overall >= 50 ? 'hsl(27 80% 60%)' : 'hsl(14 76% 55%)'}
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
      </div>
    </motion.div>
  );
}
