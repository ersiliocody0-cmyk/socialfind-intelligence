'use client';

import React, { useRef } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function Card3D({
  children,
  className = '',
  maxTilt = 5,
  glare = false,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // If user is hovering or interacting with any interactive element, keep card flat and stable
    if ((e.target as HTMLElement).closest('a, button, input, select, textarea, [role="button"]')) {
      if (contentRef.current) {
        contentRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '0';
      }
      return;
    }

    if (!cardRef.current || !contentRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    contentRef.current.style.transform = `perspective(1000px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) scale(1.01)`;

    if (glareRef.current && glare) {
      glareRef.current.style.opacity = '0.12';
      glareRef.current.style.background = `radial-gradient(circle 220px at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.2), transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out ${className}`}
    >
      <div
        ref={contentRef}
        className="w-full h-full transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        }}
      >
        {children}

        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 z-10"
          />
        )}
      </div>
    </div>
  );
}
