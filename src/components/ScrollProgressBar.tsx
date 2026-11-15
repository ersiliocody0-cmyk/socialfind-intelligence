'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, originX: 0 }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9990] h-[3px] bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.85)] pointer-events-none transition-opacity duration-200"
    />
  );
}
