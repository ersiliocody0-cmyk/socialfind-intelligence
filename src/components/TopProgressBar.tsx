'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Exported helpers to trigger the top processing bar from anywhere (search, export, etc.)
export function startProcessingProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sf:processing-start'));
  }
}

export function finishProcessingProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sf:processing-end'));
  }
}

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, finish the bar
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Listen for global processing events (search execution, data export, etc.)
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
      setProgress(75);
    };
    const handleEnd = () => {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    };

    window.addEventListener('sf:processing-start', handleStart);
    window.addEventListener('sf:processing-end', handleEnd);

    return () => {
      window.removeEventListener('sf:processing-start', handleStart);
      window.removeEventListener('sf:processing-end', handleEnd);
    };
  }, []);

  // Intercept internal link clicks to trigger progress bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      // If internal link and not a hash or external
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        !target.getAttribute('target') &&
        href !== pathname
      ) {
        setIsNavigating(true);
        setProgress(70);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          key="top-progress-bar"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: 1,
            scaleX: progress / 100,
          }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: progress === 100 ? 0.2 : 0.5, ease: 'easeOut' },
            opacity: { duration: 0.25 },
          }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 shadow-[0_0_15px_rgba(0,240,255,0.95)] pointer-events-none"
        >
          {/* Laser particle pulse on the leading tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-3.5 bg-white/90 rounded-full blur-[3px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
