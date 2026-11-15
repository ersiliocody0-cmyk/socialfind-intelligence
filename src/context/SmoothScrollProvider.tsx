'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: any) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(SmoothScrollContext);

// Smooth easeOutExpo curve for inertia stopping
const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.09,
      duration: prefersReducedMotion ? 0 : 1.2,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
      easing: easeOutExpo,
    });

    lenisRef.current = lenis;

    // Connect to requestAnimationFrame
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global interceptor for smooth anchor links (#secao, #pipeline, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, {
            offset: -60,
            duration: 1.2,
            easing: easeOutExpo,
          });
        }
      } else if (href === '#top' || href === '#') {
        e.preventDefault();
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: easeOutExpo,
        });
      }
    };

    window.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.2,
        easing: easeOutExpo,
        ...options,
      });
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
    document.documentElement.classList.add('lenis-stopped');
  };

  const start = () => {
    lenisRef.current?.start();
    document.documentElement.classList.remove('lenis-stopped');
  };

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollTo,
        stop,
        start,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
