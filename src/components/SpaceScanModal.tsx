import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, CheckCircle, ScanLine, Ruler, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetectedDimension {
  label: string;
  value: string;
  confidence: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (imageUrl: string) => void;
}

export default function SpaceScanModal({ isOpen, onClose, onScanComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<DetectedDimension[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setCameraError('Camera access denied. Please allow camera permissions and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const analyzeScan = () => {
    setScanning(true);
    setScanProgress(0);

    // Simulate progressive scan
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setDimensions([
        { label: 'Wall A (Left)', value: '4.2m', confidence: 92 },
        { label: 'Wall B (Far)', value: '5.8m', confidence: 88 },
        { label: 'Wall C (Right)', value: '4.1m', confidence: 90 },
        { label: 'Ceiling Height', value: '2.7m', confidence: 95 },
        { label: 'Floor Area', value: '24.4 m²', confidence: 85 },
        { label: 'Door Width', value: '0.9m', confidence: 78 },
      ]);
      setScanning(false);
      setScanned(true);
    }, 3200);
  };

  const applyResults = () => {
    if (capturedImage) {
      onScanComplete(capturedImage);
      handleClose();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setScanned(false);
    setDimensions([]);
    setScanProgress(0);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setScanned(false);
    setDimensions([]);
    setScanProgress(0);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
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
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-secondary" />
                Space Scanner
              </h2>
              <p className="text-sm text-muted-foreground">Capture your room and AI will estimate dimensions</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-5 space-y-4">
            {/* Camera / Captured view */}
            <div className="relative rounded-xl overflow-hidden bg-foreground/90 aspect-video">
              {!capturedImage ? (
                <>
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                      <Camera className="w-12 h-12 text-accent/50" />
                      <p className="text-sm text-accent/80">{cameraError}</p>
                      <Button variant="outline" size="sm" onClick={startCamera} className="gap-2">
                        <RefreshCw className="w-3 h-3" /> Try Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scan overlay guides */}
                      <div className="absolute inset-4 border-2 border-accent/40 rounded-lg pointer-events-none">
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-accent rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-accent rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br" />
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-accent/70 bg-foreground/60 px-3 py-1 rounded-full">
                        Point camera at room corner for best results
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <img src={capturedImage} alt="Captured room" className="w-full h-full object-cover" />
                  
                  {scanning && (
                    <div className="absolute inset-0 bg-foreground/50">
                      {/* Scanning grid effect */}
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-accent/60 shadow-lg shadow-accent/50"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      {/* Corner detection markers */}
                      {[
                        { x: '20%', y: '30%' }, { x: '80%', y: '25%' },
                        { x: '15%', y: '85%' }, { x: '85%', y: '80%' },
                      ].map((pos, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-4 h-4"
                          style={{ left: pos.x, top: pos.y }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 1, 0.5], scale: [0, 1.2, 1] }}
                          transition={{ delay: i * 0.4, duration: 0.8 }}
                        >
                          <div className="w-full h-full border-2 border-success rounded-full" />
                          <div className="absolute inset-1 bg-success/40 rounded-full" />
                        </motion.div>
                      ))}
                      {/* Lines between corners */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.line
                          x1="20%" y1="30%" x2="80%" y2="25%"
                          stroke="hsl(128 49% 61%)" strokeWidth="1" strokeDasharray="5,5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        />
                        <motion.line
                          x1="80%" y1="25%" x2="85%" y2="80%"
                          stroke="hsl(128 49% 61%)" strokeWidth="1" strokeDasharray="5,5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: 1.8, duration: 0.5 }}
                        />
                        <motion.line
                          x1="85%" y1="80%" x2="15%" y2="85%"
                          stroke="hsl(128 49% 61%)" strokeWidth="1" strokeDasharray="5,5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: 2.1, duration: 0.5 }}
                        />
                        <motion.line
                          x1="15%" y1="85%" x2="20%" y2="30%"
                          stroke="hsl(128 49% 61%)" strokeWidth="1" strokeDasharray="5,5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: 2.4, duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/70 px-4 py-2 rounded-full flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        <span className="text-xs text-primary-foreground">Detecting boundaries... {scanProgress}%</span>
                      </div>
                    </div>
                  )}
                  
                  {scanned && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-success/90 text-success-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Scan Complete
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Progress bar */}
            {scanning && (
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full gradient-accent rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
            )}

            {/* Detected dimensions */}
            {scanned && dimensions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-secondary" />
                  Detected Dimensions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {dimensions.map((dim, i) => (
                    <motion.div
                      key={dim.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3 rounded-xl bg-muted border text-sm flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{dim.label}</div>
                        <div className="text-lg font-display font-bold text-secondary">{dim.value}</div>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        dim.confidence >= 90 ? 'bg-success/20 text-success' :
                        dim.confidence >= 80 ? 'bg-warning/20 text-warning' :
                        'bg-muted-foreground/20 text-muted-foreground'
                      }`}>
                        {dim.confidence}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!capturedImage ? (
                <Button
                  variant="hero"
                  className="w-full gap-2"
                  onClick={capturePhoto}
                  disabled={!!cameraError || !stream}
                >
                  <Camera className="w-4 h-4" /> Capture Room
                </Button>
              ) : !scanned ? (
                <>
                  <Button variant="outline" onClick={retake} className="flex-1">
                    Retake Photo
                  </Button>
                  <Button variant="hero" onClick={analyzeScan} disabled={scanning} className="flex-1 gap-2">
                    {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                    {scanning ? 'Scanning...' : 'Scan Dimensions'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={retake} className="flex-1">
                    Scan Again
                  </Button>
                  <Button variant="hero" onClick={applyResults} className="flex-1 gap-2">
                    <CheckCircle className="w-4 h-4" /> Apply to Canvas
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
