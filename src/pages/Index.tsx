import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Ruler, LayoutGrid, Shield, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-floorplan.jpg';

const features = [
  { icon: LayoutGrid, title: 'Drag & Drop Editor', desc: 'Intuitive 2D floor plan editor with furniture library, room presets, and precision grid snapping.' },
  { icon: Brain, title: 'AI Layout Analysis', desc: 'Evaluate circulation, space efficiency, storage adequacy, and overall livability with smart scoring.' },
  { icon: Ruler, title: 'Smart Dimensions', desc: 'Manual input, image upload detection, or camera capture — three ways to get your room dimensions.' },
  { icon: Shield, title: 'Decision Validation', desc: 'Risk alerts for tight spaces, congestion zones, and long-term usability concerns before you commit.' },
  { icon: MessageCircle, title: 'AI Design Assistant', desc: 'Persistent AI chat that explains scores, suggests improvements, and guides you step by step.' },
  { icon: Download, title: 'Export & Share', desc: 'Download PDF reports with AI-generated evaluation, or share interactive layouts via link.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container flex flex-col items-center justify-center min-h-[85vh] md:min-h-[90vh] text-center py-16 md:py-20 px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary/30 text-accent border border-accent/20">
              AI-Powered Spatial Validation
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Design Smart.
              <br />
              <span className="text-gradient">Live Better.</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-accent/80 max-w-2xl mx-auto mb-10">
              FloorWise is not just a drawing tool — it's an intelligent spatial validation
              platform that evaluates usability, detects inefficiencies, and optimizes livability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button variant="hero" size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg w-full sm:w-auto">
                  Start Designing <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg border-accent/30 text-accent hover:bg-accent/10 rounded-2xl w-full sm:w-auto">
                  View Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 container px-4">
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
                className="glass-card p-5 md:p-6 hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4">
        <div className="container">
          <div className="gradient-primary rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Ready to validate your layout?
            </h2>
            <p className="text-accent/80 text-base md:text-lg mb-8 max-w-lg mx-auto">
              Stop guessing and start designing with confidence. FloorWise helps you make informed spatial decisions.
            </p>
            <Link to="/editor">
              <Button variant="accent" size="lg" className="gap-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold">
                Create Your First Layout <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="font-display font-semibold">FloorWise</span>
          <span>Design Smart. Live Better.</span>
        </div>
      </footer>
    </div>
  );
}
