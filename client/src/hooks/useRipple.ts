import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

export interface RippleState {
  x: number;
  y: number;
  key: number;
}

/** How long a ripple stays on screen; matches the CSS animation. */
const RIPPLE_DURATION_MS = 400;

/**
 * Click ripple state for interactive elements. Coordinates are relative to the
 * clicked element's bounding box.
 *
 * Usage:
 *   const { ripples, addRipple } = useRipple();
 *   <div onClick={addRipple} style={{ position: 'relative', overflow: 'hidden' }}>
 *     {ripples.map((r) => (
 *       <span key={r.key} className="ripple" style={{ left: r.x, top: r.y }} />
 *     ))}
 *   </div>
 */
const useRipple = () => {
  const [ripples, setRipples] = useState<RippleState[]>([]);

  // A ref, not state: generating a unique key must not cause a re-render.
  const counterRef = useRef(0);

  // Pending removals, so they can be cancelled when the component unmounts.
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const addRipple = useCallback((event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const key = counterRef.current++;
    const ripple = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      key,
    };

    setRipples((current) => [...current, ripple]);

    const timeout = setTimeout(() => {
      setRipples((current) => current.filter((item) => item.key !== key));
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeout);
    }, RIPPLE_DURATION_MS);

    timeoutsRef.current.push(timeout);
  }, []);

  return { ripples, addRipple };
};

export default useRipple;
