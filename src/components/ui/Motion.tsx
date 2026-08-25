'use client';

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

/**
 * MakeIT High-Performance Motion System
 * Guaranteed visible scroll reveals, staggered cascades, and scroll-linked depth.
 * Zero hydration errors, full prefers-reduced-motion support, GPU accelerated.
 */

export const MOTION_TIMINGS = {
  fast: 0.2,
  standard: 0.35,
  emphasis: 0.55,
  hero: 0.7,
};

export const MOTION_EASINGS = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Context to coordinate staggered cascades within containers
interface StaggerContextValue {
  parentVisible: boolean;
  staggerDelay: number;
  registerItem: () => number;
}

const StaggerContext = createContext<StaggerContextValue | null>(null);

function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

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
  distance = 28,
  className = '',
  duration = 0.6,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Check if already in viewport on mount
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Element is already visible above fold
      const timer = setTimeout(() => setIsVisible(true), 50 + delay * 1000);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    // Fallback timer to ensure content never stays hidden
    const fallback = setTimeout(() => setIsVisible(true), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay, once, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`;
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      case 'none': return 'translate3d(0, 0, 0)';
      default: return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ${MOTION_EASINGS.easeOut} ${delay}s, transform ${duration}s ${MOTION_EASINGS.easeOut} ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.07,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [parentVisible, setParentVisible] = useState(false);
  const counterRef = useRef(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      setParentVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Check if already in viewport on mount
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const timer = setTimeout(() => setParentVisible(true), 50);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setParentVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    const fallback = setTimeout(() => setParentVisible(true), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [reducedMotion]);

  // Register function to assign index to each StaggerItem
  const registerItem = () => {
    const idx = counterRef.current;
    counterRef.current += 1;
    return idx;
  };

  return (
    <StaggerContext.Provider value={{ parentVisible, staggerDelay, registerItem }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const context = useContext(StaggerContext);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (context) {
      setItemIndex(context.registerItem());
    }
  }, [context]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isVisible = context ? context.parentVisible : true;
  const delay = context ? Math.min(itemIndex * context.staggerDelay, 0.45) : 0;

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
        transition: `opacity 0.55s ${MOTION_EASINGS.easeOut} ${delay}s, transform 0.55s ${MOTION_EASINGS.easeOut} ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
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
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            setOffsetY((clamped - 0.5) * speed * 2);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const HoverArrow: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => {
  return (
    <span
      className={`inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 ${className}`}
    >
      →
    </span>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="animate-[fadeInSmooth_0.25s_ease-out]">
      {children}
    </div>
  );
};
