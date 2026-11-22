import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

/** Inertia smooth scrolling. Skipped entirely for visitors who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -96 } });
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    });
    setLenis(instance);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
