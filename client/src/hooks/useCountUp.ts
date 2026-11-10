import { useEffect, useState } from 'react';

// Evaluated once at module load — the preference rarely changes after page load.
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

/**
 * Counts from 0 up to `target`, easing out as it arrives. Visitors who prefer
 * reduced motion get the final number straight away.
 */
export const useCountUp = (target: number, duration = 800): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const startTime = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(target * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return prefersReducedMotion ? target : value;
};
