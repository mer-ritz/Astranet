import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = ["Detect", "Adapt", "Recover"];
const LOADING_VIDEO_URL = "/videos/space-loading.mp4";
const POSTER_IMAGE = "/images/brand_identity_1791897232807.jpg";

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cycling words every 900ms
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 900);
    return () => clearInterval(wordInterval);
  }, []);

  // Video autoplay check
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  // RAF counter from 000 -> 100 over 2700ms
  useEffect(() => {
    const duration = 2700;
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easing curve
      const easedProgress = Math.floor(progress * 100);
      setCount(easedProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setIsFinishing(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 sm:p-10 md:p-16 select-none pointer-events-auto overflow-hidden"
    >
      {/* Background Cinematic Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER_IMAGE}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-40 scale-105"
        >
          <source src={LOADING_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 halftone-overlay opacity-20" />
      </div>

      {/* Top Left Label */}
      <div className="flex justify-between items-start relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs text-muted uppercase tracking-[0.3em] font-medium"
        >
          ASTRANET
        </motion.div>
        
        {/* Subtle skip button for accessible instant testing */}
        <button
          onClick={onComplete}
          className="text-[11px] text-muted/60 hover:text-text-primary tracking-widest uppercase transition-colors px-2 py-1 rounded cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Center Rotating Words */}
      <div className="flex items-center justify-center h-48 sm:h-64 my-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic text-text-primary/90 text-center tracking-tight drop-shadow-lg"
          >
            {WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Counter & Progress Bar */}
      <div className="w-full flex flex-col gap-6 relative z-10">
        <div className="flex justify-end items-baseline">
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums tracking-tighter leading-none drop-shadow-md">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="w-full h-[3px] bg-stroke/50 rounded-full overflow-hidden relative">
          <div
            className="h-full accent-gradient origin-left transition-transform duration-75 ease-out"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
