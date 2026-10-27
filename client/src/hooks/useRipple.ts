import { useState, useRef, useEffect, useCallback } from 'react';

interface RippleState {
  x: number;
  y: number;
  key: number;
}

/**
 * Provides click ripple animation state for interactive elements.
 * Coordinates are relative to the clicked element's bounding rect.
 *
 * Usage:
 *   const { ripples, addRipple, clearRipples } = useRipple();
 *   <div onClick={addRipple} style={{ position: 'relative', overflow: 'hidden' }}>
 *     {ripples.map(r => (
 *       <span key={r.key} className="ripple" style={{ left: r.x, top: r.y }} />
 *     ))}
 *   </div>
 */
function useRipple(): {
  ripples: RippleState[];
  addRipple: (event: React.MouseEvent) => void;
  clearRipples: () => void;
} {
  const [ripples, setRipples] = useState<RippleState[]>([]);

  // Counter ref avoids triggering re-renders just to generate a unique key
  const counterRef = useRef(0);

  // Store all pending timeouts so they can be cleared on unmount
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up all pending timeouts when the component using this hook unmounts
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const addRipple = useCallback((event: React.MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const key = counterRef.current++;

    setRipples(prev => [...prev, { x, y, key }]);

    const id = setTimeout(() => {
      setRipples(prev => prev.filter(r => r.key !== key));
      // Remove this timeout from the tracking array
      timeoutsRef.current = timeoutsRef.current.filter(t => t !== id);
    }, 400);

    timeoutsRef.current.push(id);
  }, []);

  const clearRipples = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setRipples([]);
  }, []);

  return { ripples, addRipple, clearRipples };
}

export type { RippleState };
export default useRipple;
