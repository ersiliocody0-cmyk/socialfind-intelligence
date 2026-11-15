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
      className="fixed top-0 left-0 right-0 z-[9990] h-[2.5px] bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.7)] pointer-events-none"
    />
  );
}
