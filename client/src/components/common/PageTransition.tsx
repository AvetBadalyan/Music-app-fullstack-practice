import { useEffect, useRef, useState } from 'react';
import './PageTransition.scss';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Unique key to trigger transition on route change.
   *  Pass `location.key` from `useLocation()` in the parent layout. */
  transitionKey: string;
}

type TransitionPhase = 'enter' | 'entered' | 'exit';

/** Duration in ms — must match the `page-fade-out` keyframe (200ms). */
const EXIT_MS = 200;
/** Duration in ms — must match the `page-fade-slide-in` keyframe (300ms). */
const ENTER_MS = 300;

/**
 * Wraps route content with animated page transitions.
 *
 * Flow on route change:
 * 1. **Exit** — current content fades out over 200ms (`.page-transition-exit`)
 * 2. **Enter** — new content fades in with a 12px slide-up over 300ms (`.page-transition-enter`)
 * 3. **Entered** — animation classes removed; normal pointer events restored
 *
 * Pointer events are disabled during the exit phase so users cannot
 * accidentally interact with content that is about to be replaced.
 *
 * Scroll position is reset to the top of the page between phases so the
 * incoming route always starts at the top.
 *
 * Animation keyframes are defined in `styles/_animations.scss` and emitted
 * globally — no local keyframe duplication needed here.
 */
const PageTransition = ({ children, transitionKey }: PageTransitionProps) => {
  const [phase, setPhase] = useState<TransitionPhase>('entered');
  const prevKeyRef = useRef(transitionKey);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Same key → same route, no transition needed (handles re-renders within
    // the same route, e.g. when async data arrives).
    if (transitionKey === prevKeyRef.current) return;
    prevKeyRef.current = transitionKey;

    // Cancel any in-flight transition before starting a new one.
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Phase 1 — exit: fade-out current content.
    setPhase('exit');

    timerRef.current = setTimeout(() => {
      // Scroll to top before the entering page is revealed so the viewport
      // always starts at position (0, 0) — satisfies Requirement 1.4.
      window.scrollTo(0, 0);

      // Phase 2 — enter: fade-in + slide-up new content.
      setPhase('enter');

      timerRef.current = setTimeout(() => {
        // Phase 3 — entered: animation complete, remove classes.
        setPhase('entered');
        timerRef.current = null;
      }, ENTER_MS);
    }, EXIT_MS);
  }, [transitionKey]);

  // Cleanup on unmount to prevent state updates on a removed component.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const className = [
    'page-transition',
    phase === 'exit' ? 'page-transition-exit' : null,
    phase === 'enter' ? 'page-transition-enter' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={className}>{children}</div>;
};

export default PageTransition;
