import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * A custom hook for using GSAP animations within a React component.
 * Ensures proper cleanup and scoping using gsap.context().
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  dependencies: any[] = []
) {
  const container = useRef<any>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(callback, container);
    return () => ctx.revert();
  }, dependencies);

  return container;
}

export { gsap, ScrollTrigger };
