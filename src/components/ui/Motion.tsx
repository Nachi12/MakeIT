'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, Variants } from 'framer-motion';

/**
 * MakeIT Centralized Motion System
 * Reusable motion tokens & primitives using Framer Motion.
 * Fully supports prefers-reduced-motion.
 *
 * HYDRATION SAFETY: All primitives render as static visible content
 * during SSR and first client render. Animations only activate after
 * mount via useHasMounted(), preventing style mismatches between
 * server HTML (no JS) and client hydration.
 */

/** Returns false during SSR and first render, true after mount. */
function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export const MOTION_TIMINGS = {
  fast: 0.2,
  standard: 0.35,
  emphasis: 0.5,
  hero: 0.7,
};

export const MOTION_EASINGS = {
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number], // Smooth editorial ease-out
  spring: { type: 'spring', stiffness: 300, damping: 25 },
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  duration?: number;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 20,
  className = '',
  duration = MOTION_TIMINGS.standard,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();

  // Before mount or when reduced motion is active, render static content
  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'none': return {};
      default: return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-10%' }}
      transition={{
        duration,
        delay,
        ease: MOTION_EASINGS.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.06,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();

  // Before mount or when reduced motion is active, render static content
  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10%' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();

  // Before mount or when reduced motion is active, render static content
  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_TIMINGS.standard,
        ease: MOTION_EASINGS.easeOut,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g., -20 to 20 px
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = -20,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed]);

  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

export const HoverArrow: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => {
  return (
    <motion.span
      className="inline-block"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      →
    </motion.span>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useHasMounted();

  if (!mounted || shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
