import type { ReactNode } from 'react';
import './PageTransition.scss';

interface PageTransitionProps {
  children: ReactNode;
  /** When this value changes the page fades in again. Pass the pathname. */
  transitionKey: string;
}

/**
 * Fades each new page in. React treats a changed `key` as a brand-new element,
 * so the wrapper is recreated and its CSS animation plays from the start.
 *
 * Use the pathname as the key, not `location.key`: `location.key` changes on
 * every navigation, including filter changes in the query string, and the
 * whole page would fade again each time a chip is toggled.
 */
const PageTransition = ({ children, transitionKey }: PageTransitionProps) => (
  <div key={transitionKey} className="page-transition">
    {children}
  </div>
);

export default PageTransition;
