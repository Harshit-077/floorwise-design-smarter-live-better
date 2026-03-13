import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Ruler, LayoutGrid, Shield, Download, MessageCircle, Leaf, TreePine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: LayoutGrid, title: 'Drag & Drop Editor', desc: 'Intuitive 2D floor plan editor with furniture library, room presets, and precision grid snapping.' },
  { icon: Brain, title: 'AI Layout Analysis', desc: 'Evaluate circulation, space efficiency, storage adequacy, and overall livability with smart scoring.' },
  { icon: Ruler, title: 'Smart Dimensions', desc: 'Manual input, image upload detection, or camera capture — three ways to get your room dimensions.' },
  { icon: Shield, title: 'Decision Validation', desc: 'Risk alerts for tight spaces, congestion zones, and long-term usability concerns before you commit.' },
  { icon: MessageCircle, title: 'AI Design Assistant', desc: 'Persistent AI chat that explains scores, suggests improvements, and guides you step by step.' },
  { icon: Download, title: 'Export & Share', desc: 'Download PDF reports with AI-generated evaluation, or share interactive layouts via link.' },
];

const steps = [
  { num: '01', title: 'Scan or Create', desc: 'Point your camera at a room, upload a floor plan, or start from scratch with drag-and-drop.', icon: Ruler },
  { num: '02', title: 'Design & Furnish', desc: 'Place walls, doors, windows, and furniture. Customize everything from sofa shapes to room sizes.', icon: LayoutGrid },
  { num: '03', title: 'Analyze & Optimize', desc: 'Get AI-powered insights on circulation, livability, and spatial efficiency. Refine until perfect.', icon: Brain },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

// Leaf particles for hero background
function LeafParticles() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 14,
    duration: 10 + Math.random() * 12,
    delay: Math.random() * 10,
    driftX: (Math.random() - 0.5) * 160,
    driftY: -(100 + Math.random() * 250),
    driftR: Math.random() * 360,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map(l => (
        <div
          key={l.id}
          className="absolute leaf-particle"
          style={{
            left: l.left,
            bottom: '-20px',
            '--duration': `${l.duration}s`,
            '--delay': `${l.delay}s`,
            '--drift-x': `${l.driftX}px`,
            '--drift-y': `${l.driftY}px`,
            '--drift-r': `${l.driftR}deg`,
            opacity: l.opacity,
          } as React.CSSProperties}
        >
          <Leaf className="text-emerald-400/60" style={{ width: l.size, height: l.size }} />
        </div>
      ))}
    </div>
  );
}

// House skyline silhouette for hero bottom
function HouseSkyline() {
  return (
    <div className="absolute bottom-16 left-0 right-0 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none" style={{ minHeight: 120 }}>
        {/* Trees on far left */}
        <ellipse cx="60" cy="170" rx="30" ry="50" fill="rgba(34,197,94,0.07)" />
        <ellipse cx="100" cy="155" rx="25" ry="60" fill="rgba(34,197,94,0.05)" />
        <rect x="57" y="170" width="6" height="40" fill="rgba(34,197,94,0.06)" rx="2"/>

        {/* House 1 — small cottage left */}
        <rect x="160" y="130" width="90" height="80" fill="rgba(255,255,255,0.04)" rx="2"/>
        <polygon points="160,130 205,85 250,130" fill="rgba(255,255,255,0.06)" />
        {/* Door */}
        <rect x="190" y="170" width="20" height="40" fill="rgba(255,255,255,0.03)" rx="1"/>
        {/* Window */}
        <rect x="170" y="145" width="14" height="14" fill="rgba(250,204,21,0.12)" rx="1"/>
        <rect x="226" y="145" width="14" height="14" fill="rgba(250,204,21,0.10)" rx="1"/>
        {/* Chimney */}
        <rect x="225" y="95" width="10" height="35" fill="rgba(255,255,255,0.04)" rx="1"/>

        {/* Tree between houses */}
        <ellipse cx="310" cy="150" rx="22" ry="50" fill="rgba(34,197,94,0.06)" />
        <rect x="307" y="155" width="6" height="55" fill="rgba(34,197,94,0.05)" rx="2"/>

        {/* House 2 — modern two-story center-left */}
        <rect x="370" y="90" width="110" height="120" fill="rgba(255,255,255,0.05)" rx="3"/>
        <rect x="370" y="80" width="110" height="12" fill="rgba(255,255,255,0.04)" rx="1"/>
        {/* Windows row 1 */}
        <rect x="385" y="100" width="18" height="16" fill="rgba(250,204,21,0.14)" rx="1"/>
        <rect x="415" y="100" width="18" height="16" fill="rgba(250,204,21,0.10)" rx="1"/>
        <rect x="445" y="100" width="18" height="16" fill="rgba(250,204,21,0.12)" rx="1"/>
        {/* Windows row 2 */}
        <rect x="385" y="135" width="18" height="16" fill="rgba(250,204,21,0.08)" rx="1"/>
        <rect x="415" y="135" width="18" height="16" fill="rgba(250,204,21,0.13)" rx="1"/>
        <rect x="445" y="135" width="18" height="16" fill="rgba(250,204,21,0.06)" rx="1"/>
        {/* Door */}
        <rect x="410" y="175" width="24" height="35" fill="rgba(255,255,255,0.03)" rx="1"/>

        {/* House 3 — large central house */}
        <rect x="560" y="100" width="140" height="110" fill="rgba(255,255,255,0.05)" rx="3"/>
        <polygon points="545,100 630,40 715,100" fill="rgba(255,255,255,0.06)" />
        {/* Dormer window */}
        <rect x="615" y="55" width="16" height="14" fill="rgba(250,204,21,0.15)" rx="1"/>
        {/* Windows */}
        <rect x="575" y="120" width="22" height="20" fill="rgba(250,204,21,0.13)" rx="1"/>
        <rect x="618" y="120" width="22" height="20" fill="rgba(250,204,21,0.09)" rx="1"/>
        <rect x="662" y="120" width="22" height="20" fill="rgba(250,204,21,0.12)" rx="1"/>
        {/* Door with steps */}
        <rect x="616" y="170" width="28" height="40" fill="rgba(255,255,255,0.04)" rx="2"/>
        <rect x="610" y="200" width="40" height="10" fill="rgba(255,255,255,0.03)" rx="1"/>
        {/* Chimney */}
        <rect x="670" y="55" width="12" height="45" fill="rgba(255,255,255,0.04)" rx="1"/>

        {/* Tree */}
        <ellipse cx="770" cy="145" rx="28" ry="55" fill="rgba(34,197,94,0.07)" />
        <rect x="767" y="155" width="6" height="55" fill="rgba(34,197,94,0.05)" rx="2"/>

        {/* House 4 — apartment style right */}
        <rect x="830" y="70" width="100" height="140" fill="rgba(255,255,255,0.04)" rx="3"/>
        <rect x="830" y="62" width="100" height="10" fill="rgba(255,255,255,0.03)" rx="1"/>
        {/* Windows grid */}
        {[0,1,2,3].map(row => [0,1,2].map(col => (
          <rect key={`${row}-${col}`} x={845 + col * 28} y={80 + row * 30} width="16" height="14"
            fill={`rgba(250,204,21,${0.06 + (row * 3 + col) * 0.015})`} rx="1"/>
        )))}
        {/* Door */}
        <rect x="868" y="180" width="22" height="30" fill="rgba(255,255,255,0.03)" rx="1"/>

        {/* House 5 — small house far right */}
        <rect x="990" y="140" width="80" height="70" fill="rgba(255,255,255,0.04)" rx="2"/>
        <polygon points="985,140 1030,100 1075,140" fill="rgba(255,255,255,0.05)" />
        {/* Window */}
        <rect x="1000" y="155" width="14" height="12" fill="rgba(250,204,21,0.10)" rx="1"/>
        <rect x="1046" y="155" width="14" height="12" fill="rgba(250,204,21,0.08)" rx="1"/>
        {/* Door */}
        <rect x="1020" y="175" width="18" height="35" fill="rgba(255,255,255,0.03)" rx="1"/>

        {/* Trees far right */}
        <ellipse cx="1130" cy="155" rx="25" ry="50" fill="rgba(34,197,94,0.06)" />
        <ellipse cx="1170" cy="145" rx="20" ry="55" fill="rgba(34,197,94,0.05)" />
        <rect x="1127" y="160" width="6" height="50" fill="rgba(34,197,94,0.05)" rx="2"/>

        {/* Tiny house far right */}
        <rect x="1250" y="155" width="60" height="55" fill="rgba(255,255,255,0.03)" rx="2"/>
        <polygon points="1245,155 1280,120 1315,155" fill="rgba(255,255,255,0.04)" />
        <rect x="1260" y="170" width="10" height="10" fill="rgba(250,204,21,0.08)" rx="1"/>
        <rect x="1290" y="170" width="10" height="10" fill="rgba(250,204,21,0.06)" rx="1"/>

        {/* Trees far far right */}
        <ellipse cx="1380" cy="160" rx="30" ry="45" fill="rgba(34,197,94,0.05)" />
        <rect x="1377" y="165" width="6" height="45" fill="rgba(34,197,94,0.04)" rx="2"/>

        {/* Ground line */}
        <rect x="0" y="210" width="1440" height="10" fill="rgba(255,255,255,0.02)" rx="2"/>
      </svg>
    </div>
  );
}

// Floor plan blueprint illustration
function FloorPlanIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative max-w-md mx-auto"
    >
      <div className="relative bg-emerald-50/70 border-2 border-emerald-200/60 rounded-2xl p-4 shadow-lg shadow-emerald-500/5">
        {/* Blueprint title */}
        <div className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-semibold mb-3 font-display">Floor Plan Preview</div>
        <svg viewBox="0 0 300 200" fill="none" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Grid */}
          <defs>
            <pattern id="bp-grid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="300" height="200" fill="url(#bp-grid)" rx="4"/>

          {/* Living Room */}
          <rect x="10" y="10" width="140" height="100" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" rx="2"/>
          <text x="80" y="55" textAnchor="middle" fontSize="8" fill="rgba(16,185,129,0.7)" fontWeight="600" fontFamily="Space Grotesk, sans-serif">Living Room</text>
          <text x="80" y="67" textAnchor="middle" fontSize="6" fill="rgba(16,185,129,0.4)">4.2m × 3.0m</text>
          {/* Sofa */}
          <rect x="20" y="25" width="40" height="15" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" rx="2"/>
          <text x="40" y="35" textAnchor="middle" fontSize="5" fill="rgba(16,185,129,0.5)">Sofa</text>
          {/* TV */}
          <rect x="125" y="45" width="15" height="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" rx="1"/>

          {/* Kitchen */}
          <rect x="10" y="115" width="100" height="75" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.35)" strokeWidth="1.5" rx="2"/>
          <text x="60" y="150" textAnchor="middle" fontSize="8" fill="rgba(245,158,11,0.6)" fontWeight="600" fontFamily="Space Grotesk, sans-serif">Kitchen</text>
          <text x="60" y="162" textAnchor="middle" fontSize="6" fill="rgba(245,158,11,0.35)">3.0m × 2.2m</text>
          {/* Counter */}
          <rect x="15" y="125" width="50" height="8" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.5" rx="1"/>

          {/* Bedroom */}
          <rect x="155" y="10" width="135" height="120" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5" rx="2"/>
          <text x="222" y="65" textAnchor="middle" fontSize="8" fill="rgba(59,130,246,0.6)" fontWeight="600" fontFamily="Space Grotesk, sans-serif">Bedroom</text>
          <text x="222" y="77" textAnchor="middle" fontSize="6" fill="rgba(59,130,246,0.35)">4.0m × 3.6m</text>
          {/* Bed */}
          <rect x="210" y="25" width="50" height="35" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.8" rx="2"/>
          <text x="235" y="46" textAnchor="middle" fontSize="5" fill="rgba(59,130,246,0.45)">Bed</text>
          {/* Wardrobe */}
          <rect x="165" y="100" width="35" height="12" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" rx="1"/>

          {/* Bathroom */}
          <rect x="155" y="135" width="135" height="55" fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" rx="2"/>
          <text x="222" y="162" textAnchor="middle" fontSize="8" fill="rgba(168,85,247,0.5)" fontWeight="600" fontFamily="Space Grotesk, sans-serif">Bathroom</text>
          <text x="222" y="174" textAnchor="middle" fontSize="6" fill="rgba(168,85,247,0.3)">4.0m × 1.6m</text>

          {/* Doors (arcs) */}
          <path d="M 150 80 A 15 15 0 0 1 150 65" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1" strokeDasharray="2 1.5"/>
          <line x1="150" y1="65" x2="150" y2="80" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
          <path d="M 155 130 A 12 12 0 0 1 167 130" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1" strokeDasharray="2 1.5"/>
          <path d="M 55 115 A 12 12 0 0 0 55 103" fill="none" stroke="rgba(245,158,11,0.35)" strokeWidth="1" strokeDasharray="2 1.5"/>

          {/* Dimension lines */}
          <line x1="10" y1="196" x2="150" y2="196" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5"/>
          <line x1="10" y1="193" x2="10" y2="199" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5"/>
          <line x1="150" y1="193" x2="150" y2="199" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5"/>
          <line x1="155" y1="196" x2="290" y2="196" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
          <line x1="155" y1="193" x2="155" y2="199" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
          <line x1="290" y1="193" x2="290" y2="199" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
        </svg>
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400/40 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400/40 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400/40 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400/40 rounded-br" />
      </div>
    </motion.div>
  );
}

// CTA house silhouette
function CTAHouseDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Left house outline */}
      <svg viewBox="0 0 200 200" className="absolute -left-10 bottom-0 w-40 h-40 opacity-[0.07]" fill="white">
        <polygon points="100,20 180,80 180,180 20,180 20,80" />
        <polygon points="100,20 20,80 180,80" />
        <rect x="80" y="120" width="40" height="60" rx="2"/>
        <rect x="40" y="95" width="25" height="25" rx="2"/>
        <rect x="135" y="95" width="25" height="25" rx="2"/>
      </svg>
      {/* Right house outline */}
      <svg viewBox="0 0 200 200" className="absolute -right-5 bottom-0 w-36 h-36 opacity-[0.06]" fill="white">
        <rect x="20" y="40" width="160" height="140" rx="4"/>
        <rect x="20" y="30" width="160" height="14" rx="2"/>
        {[0,1,2].map(r => [0,1,2].map(c => (
          <rect key={`${r}${c}`} x={40 + c * 45} y={60 + r * 40} width="20" height="18" rx="2" opacity="0.4"/>
        )))}
        <rect x="85" y="140" width="30" height="40" rx="2" opacity="0.5"/>
      </svg>
    </div>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden">
        {/* Organic glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />

        <LeafParticles />
        <HouseSkyline />

        <div className="relative container flex flex-col items-center justify-center min-h-[85vh] md:min-h-[90vh] text-center py-16 md:py-20 px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Spatial Validation
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Design Smart.
              <br />
              <span className="text-gradient">Live Better.</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-emerald-100/70 max-w-2xl mx-auto mb-10">
              FloorWise is not just a drawing tool — it's an intelligent spatial validation
              platform that evaluates usability, detects inefficiencies, and optimizes livability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button variant="hero" size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 rounded-2xl shadow-lg shadow-emerald-500/25">
                  Start Designing <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 rounded-2xl w-full sm:w-auto">
                  View Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Organic wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 40 C360 80, 720 0, 1080 50 C1260 70, 1380 30, 1440 40 L1440 100 L0 100 Z" fill="hsl(220 20% 97%)" />
          </svg>
        </div>
      </section>

      {/* How It Works + Floor Plan Illustration */}
      <section className="py-16 md:py-24 container px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            <TreePine className="w-3 h-3" /> HOW IT WORKS
          </span>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Three Steps to Your Perfect Space</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            From capturing your room to AI-powered optimization, done in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div className="grid grid-cols-1 gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative p-5 rounded-2xl border bg-gradient-to-br from-card to-emerald-50/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-display font-bold text-emerald-500/30 group-hover:text-emerald-500/60 transition-colors">{s.num}</span>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold">{s.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <FloorPlanIllustration />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
        <div className="container px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4">More Than a Drawing Tool</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              A digital functional architect that prioritizes function over decoration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="glass-card p-5 md:p-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group border-emerald-100/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/20">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 text-center bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
            <CTAHouseDecor />
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold rounded-full bg-white/15 text-white/90">
                <Leaf className="w-3 h-3" /> Get Started Free
              </div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to validate your layout?
              </h2>
              <p className="text-base md:text-lg mb-8 max-w-lg mx-auto text-emerald-100/80">
                Stop guessing and start designing with confidence. FloorWise helps you make informed spatial decisions.
              </p>
              <Link to="/editor">
                <Button size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl shadow-lg">
                  Create Your First Layout <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="font-display font-semibold flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-500" /> FloorWise
          </span>
          <span>Design Smart. Live Better.</span>
        </div>
      </footer>
    </div>
  );
}
