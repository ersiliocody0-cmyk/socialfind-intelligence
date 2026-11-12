'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
          className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.8)] pointer-events-none"
        />
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
