'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Subtle page scroll progress indicator.
 * A thin orange line at the top of the viewport that tracks scroll depth.
 * Invisible until the user starts scrolling. Respects prefers-reduced-motion.
 */
export const ScrollProgress: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  useEffect(() => setMounted(true), []);

  // Don't render during SSR, when reduced motion is active, or before mount
  if (!mounted || shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#F97316] z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};
