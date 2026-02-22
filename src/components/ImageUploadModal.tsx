import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Loader2, CheckCircle, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImageLoaded: (imageUrl: string) => void;
}

export default function ImageUploadModal({ isOpen, onClose, onImageLoaded }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [detectedRooms, setDetectedRooms] = useState<{ name: string; dims: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setAnalyzed(false);
      setDetectedRooms([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const analyzeImage = () => {
    if (!preview) return;
    setAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setDetectedRooms([
        { name: 'Living Room', dims: '5.2m × 4.1m' },
        { name: 'Master Bedroom', dims: '4.0m × 3.5m' },
        { name: 'Kitchen', dims: '3.8m × 2.9m' },
        { name: 'Bathroom', dims: '2.4m × 2.0m' },
        { name: 'Hallway', dims: '4.5m × 1.2m' },
      ]);
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  const applyToCanvas = () => {
    if (preview) {
      onImageLoaded(preview);
      onClose();
      setPreview(null);
      setAnalyzed(false);
      setDetectedRooms([]);
    }
  };

  const reset = () => {
    setPreview(null);
    setAnalyzed(false);
    setDetectedRooms([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Upload Floor Plan</h2>
              <p className="text-sm text-muted-foreground">Upload an image and AI will detect rooms & dimensions</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-5 space-y-4">
            {!preview ? (
              /* Drop zone */
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                  dragOver ? 'border-secondary bg-secondary/10' : 'border-border hover:border-secondary/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium mb-1">Drop your floor plan image here</p>
                <p className="text-sm text-muted-foreground">or click to browse — PNG, JPG, WEBP supported</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
            ) : (
              /* Preview + Analysis */
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border bg-muted">
                  <img src={preview} alt="Floor plan" className="w-full max-h-80 object-contain" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <Loader2 className="w-10 h-10 text-accent animate-spin" />
                        <div className="absolute inset-0 border-2 border-accent/30 rounded-full animate-pulse-ring" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-primary-foreground">Analyzing floor plan...</p>
                        <p className="text-xs text-accent/70">Detecting walls, rooms & dimensions</p>
                      </div>
                      {/* Scanning line animation */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-accent/60"
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  )}
                  {analyzed && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-success/90 text-success-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Analysis Complete
                      </div>
                    </div>
                  )}
                </div>

                {/* Detected rooms */}
                {analyzed && detectedRooms.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Image className="w-4 h-4 text-secondary" />
                      Detected Rooms ({detectedRooms.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {detectedRooms.map((room, i) => (
                        <motion.div
                          key={room.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-xl bg-muted border text-sm"
                        >
                          <div className="font-medium">{room.name}</div>
                          <div className="text-xs text-muted-foreground">{room.dims}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset} className="flex-1">
                    Upload Different Image
                  </Button>
                  {!analyzed ? (
                    <Button variant="hero" onClick={analyzeImage} disabled={analyzing} className="flex-1 gap-2">
                      {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ZoomIn className="w-4 h-4" />}
                      {analyzing ? 'Analyzing...' : 'Detect Rooms & Dimensions'}
                    </Button>
                  ) : (
                    <Button variant="hero" onClick={applyToCanvas} className="flex-1 gap-2">
                      <CheckCircle className="w-4 h-4" /> Apply to Canvas
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
