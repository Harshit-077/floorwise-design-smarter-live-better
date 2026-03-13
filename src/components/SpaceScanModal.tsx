import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, CheckCircle, ScanLine, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [cameraError, setCameraError] = useState<string | null>(null);

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

  const applyAsBackground = () => {
    if (capturedImage) {
      onScanComplete(capturedImage);
      handleClose();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
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
              <p className="text-sm text-muted-foreground">Capture your room to use as a background reference</p>
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
                      <div className="absolute inset-4 border-2 border-accent/40 rounded-lg pointer-events-none">
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-accent rounded-tl" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-accent rounded-tr" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br" />
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-accent/70 bg-foreground/60 px-3 py-1 rounded-full">
                        Point camera at your room
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img src={capturedImage} alt="Captured room" className="w-full h-full object-cover" />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Info notice */}
            <div className="p-3 rounded-xl bg-muted/50 border flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Reference Image Only</p>
                <p>This photo will be used as a background overlay on the canvas so you can trace your room layout manually. For accurate measurements, use a measuring tape and enter dimensions in the properties panel.</p>
              </div>
            </div>

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
              ) : (
                <>
                  <Button variant="outline" onClick={retake} className="flex-1">
                    Retake Photo
                  </Button>
                  <Button variant="hero" onClick={applyAsBackground} className="flex-1 gap-2">
                    <CheckCircle className="w-4 h-4" /> Use as Background
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
